import taskModel from "../../models/task.model.js";
import tasklistModel from "../../models/tasklist.model.js";
import { findByIdAndVerifyUser, safeCreate, safeDelete, safeDeleteById, safeFind, safeFindById, safeFindOne, safeUpdateById } from "../../utils/safeMongoose.js";
import { tasklistSchema } from "../../middleware/validationSchemas.js";
import { responseError } from "../../utils/errorHandler.js";
import mongoose from "mongoose";

const taskService = {
    getTasks: async (userId, query) => { //? hard to understand logic ?
        const showCompleted = query.showCompleted == "true" ? {} : { completedAt: null };
        const showSubtasks = query.showSubtasks == "true" ? {} : { parentId: null };
        const showDeleted = query.showDeleted == "true" ? {} : { deletedAt: null };
        let filterObject = { userId, ...showCompleted, ...showSubtasks, ...showDeleted };
        return await safeFind(taskModel, filterObject);
    },
    createTask: async (userId, newTask) => {
        newTask.userId = userId;
        const { tasklistId, tasklistTitle, parentId } = newTask;

        if (parentId) {
            const parentTask = await findByIdAndVerifyUser(taskModel, newTask.parentId, userId)
            newTask.tasklistId = parentTask.tasklistId
            return await safeCreate(taskModel, newTask);
        };

        if (tasklistId) {
            await findByIdAndVerifyUser(tasklistModel, tasklistId, userId);
            return await safeCreate(taskModel, newTask);
        }

        if (tasklistTitle) { //Safe Find or create
            let fetchedTasklist = await safeFindOne(tasklistModel, { title: tasklistTitle, userId }, { errOnNotFound: false });
            if (!fetchedTasklist) {
                fetchedTasklist = await safeCreate(tasklistModel, { title: tasklistTitle, userId });
            }
            newTask.tasklistId = fetchedTasklist._id;
            return await safeCreate(taskModel, newTask);
        }

        let inboxTasklist = await safeFindOne(tasklistModel, { userId, isDefault: true, deletedAt: null }, { errOnNotFound: false });
        if (!inboxTasklist) {
            inboxTasklist = await safeCreate(tasklistModel, { title: "Inbox", userId, isDefault: true }); //TODOTEST
        }
        newTask.tasklistId = inboxTasklist._id;
        return await safeCreate(taskModel, newTask);
    },

    getTaskById: async (userId, taskId) => {
        return await findByIdAndVerifyUser(taskModel, taskId, userId);
    },

    updateTaskById: async (userId, taskId, updatedTask) => { //TODO Add validation for nested tasks
        await findByIdAndVerifyUser(taskModel, taskId, userId);
        if (updatedTask.tasklistId) await findByIdAndVerifyUser(tasklistModel, updatedTask.tasklistId, userId); //TODOTEST if trying to move to tasklist of another user
        if (updatedTask.parentId) await findByIdAndVerifyUser(taskModel, updatedTask.parentId, userId); //TODOTEST if trying to append as subtask to a task of another user
        return await safeUpdateById(taskModel, taskId, updatedTask);
    },

    deleteTaskById: async (userId, taskId) => { //TODOTEST
        await findByIdAndVerifyUser(taskModel, taskId, userId);
        if (Boolean(process.env.dev)) { // disabling transactions in local environment
            await safeDeleteById(taskModel, taskId);
            await safeDelete(taskModel, { parentId: taskId });
        } else {
            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                await taskModel.deleteOne({ _id: taskId }, { session });
                await taskModel.deleteMany({ parentId: taskId }, { session });
                await session.commitTransaction();
            } catch (error) {
                await session.abortTransaction();
                throw responseError(500, "Error deleting task", error);
            } finally {
                session.endSession();
            }
        }
    },

    toggleTaskCompletionById: async (userId, taskId) => {
        const task = await findByIdAndVerifyUser(taskModel, taskId, userId);
        if (!task.completedAt) return await safeUpdateById(taskModel, taskId, { completedAt: Date.now() });
        else return await safeUpdateById(taskModel, taskId, { completedAt: null });
    },

    getSubtasksByTaskId: async (userId, taskId) => {
        await findByIdAndVerifyUser(taskModel, taskId, userId);
        return await safeFind(taskModel, { userId, parentId: taskId });
    }
}

export default taskService
