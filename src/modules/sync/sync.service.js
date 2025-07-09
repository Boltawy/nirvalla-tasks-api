import { responseError } from "../../utils/errorHandler.js";
import { safeCreate, safeDeleteById, safeFind, safeFindOne, safeUpdateById, findByIdAndVerifyUser, safeDelete } from "../../utils/safeMongoose.js";
import taskListModel from "../../models/taskList.model.js";
import taskModel from "../../models/task.model.js";
import mongoose, { isValidObjectId } from "mongoose";


const utils = {
    flattenTasks: (parentTasks) => {
        const result = [];
        const recurse = (tasks) => {
            for (const task of tasks) {
                const { subtasks = [], ...rest } = task;
                result.push({ ...rest })
                if (subtasks.length > 0) recurse(subtasks);
            }
        };
        recurse(parentTasks);
        return result;
    },
    recursiveGenerateTaskId: (parentTaskId, subtasks) => {
        return subtasks.map((task) => {
            return {
                ...task,
                parentId: parentTaskId,
                subtasks: (task.subtasks.length > 0 ? utils.recursiveGenerateTaskId(task._id, task.subtasks) : [])
            }
        })
    }
}



const syncService = {

    generateMongoIds: (populatedLists) => { //TODO handle subtasks recursively
        return populatedLists.map((list) => {
            let newListId;
            if (!isValidObjectId(list._id)) newListId = new mongoose.Types.ObjectId();
            return {
                ...list,
                _id: newListId || list._id,
                tasks: list.tasks.map((task) => {
                    let newTaskId
                    if (!isValidObjectId(task._id)) newTaskId = new mongoose.Types.ObjectId();
                    let newTask = {
                        ...task,
                        _id: newTaskId || task._id,
                        taskListId: newListId || list._id,
                    }
                    if (task.subtasks.length > 0) newTask.subtasks = utils.recursiveGenerateTaskId(newTask._id, task.subtasks);
                    return newTask
                })
            }
        })
    },

    populateLists: async (userId) => {
        const taskLists = await safeFind(taskListModel, { userId, deletedAt: null }, { sort: { createdAt: 1 }, projection: { __v: 0 }, lean: true });
        const tasks = await safeFind(taskModel, { userId, deletedAt: null, completedAt: null }, { sort: { createdAt: 1 }, projection: { __v: 0 }, lean: true });
        taskLists.forEach((list) => {
            Object.assign(list, { tasks: [] })
        })
        tasks.forEach((task) => {
            Object.assign(task, { subtasks: [] })
        })
        for (const task of tasks) {
            if (task.parentId) tasks.find((parentTask) => parentTask._id.toString() == task.parentId.toString()).subtasks?.push(task);
            else taskLists.find((list) => list._id.toString() == task.taskListId.toString()).tasks.push(task);
        }
        return taskLists;
    },

    depopulateLists: async (populatedLists) => {
        const tasklists = populatedLists.map(({ tasks, ...listWithoutTasks }) => listWithoutTasks); //nice pattern, destructure the object so you leave out what you don't need

        const parentTasks = [];
        for (const list of populatedLists) {
            list.tasks.forEach((task) => {
                parentTasks.push(task);
            })
        }
        const tasks = utils.flattenTasks(parentTasks);
        return { tasklists, tasks }
    },

    // InvalidateAndUpdate: async (sentTasklists, sentTasks) => {
    //     //STEP Fetch current tasks and tasklists
    //     //STEP compare the size of tasks and lists, If changed then 
    //     //STEP loop over the sent tasklists and verify it exists in db, If not, Add it
    //     //STEP Check if and update the status of deletedAt for all tasks
    // },

    forcePush: async (userId, sentTasklists, sentTasks) => { //! Completely overwrites user data
        if (Boolean(process.env.dev)) {
            await safeDelete(taskModel, { userId, deletedAt: null }, { hardDelete: true, errOnNotFound: false });
            await safeDelete(taskListModel, { userId, deletedAt: null }, { hardDelete: true, errOnNotFound: false });
            await safeCreate(taskListModel, sentTasklists);
            await safeCreate(taskModel, sentTasks);
        }
        else {
            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                await safeDelete(taskModel, { userId, deletedAt: null }, { hardDelete: true, errOnNotFound: false, session });
                await safeDelete(taskListModel, { userId, deletedAt: null }, { hardDelete: true, errOnNotFound: false, session });
                await safeCreate(taskListModel, sentTasklists, { session });
                await safeCreate(taskModel, sentTasks, { session });
                await session.commitTransaction();
            } catch (error) {
                await session.abortTransaction();
                throw new responseError(500, "Error in Sync", error);
            } finally {
                session.endSession();
            }
        }
    }
}

export default syncService

