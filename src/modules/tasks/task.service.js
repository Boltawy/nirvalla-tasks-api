import taskModel from "../../models/task.model.js";
import taskListModel from "../../models/taskList.model.js";
import { findByIdAndVerifyUser, safeCreate, safeDelete, safeDeleteById, safeFind, safeFindById, safeFindOne, safeUpdateById } from "../../utils/dbSafeUtils.js";
import { taskListSchema } from "../../middleware/validationSchemas.js";
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
        const { taskListId, taskListTitle, parentId } = newTask;

        if (parentId) { 
            const parentTask = await findByIdAndVerifyUser(taskModel, newTask.parentId, userId)
            newTask.taskListId = parentTask.taskListId
            return await safeCreate(taskModel, newTask);
        };

        if (taskListId) {
            await findByIdAndVerifyUser(taskListModel, taskListId, userId);
            return await safeCreate(taskModel, newTask);
        }
        
        if (taskListTitle) { //Safe Find or create
            const fetchedTaskList = await safeFindOne(taskListModel, { title: taskListTitle, userId }, { errOnNotFound: false });
            if (!fetchedTaskList) {
                fetchedTaskList = await safeCreate(taskListModel, { title: taskListTitle, userId });
            }
            newTask.taskListId = fetchedTaskList._id;
            return await safeCreate(taskModel, newTask);
        }

        const inboxTaskList = await safeFindOne(taskListModel, { userId, isDefault: true });
        newTask.taskListId = inboxTaskList._id;
        return await safeCreate(taskModel, newTask);
    },

    getTaskById: async (userId, taskId) => {
        return await findByIdAndVerifyUser(taskModel, taskId, userId);
    },

    updateTaskById: async (userId, taskId, updatedTask) => { //TODO Add validation for nested tasks
        await findByIdAndVerifyUser(taskModel, taskId, userId);
        if (updatedTask.taskListId) await findByIdAndVerifyUser(taskListModel, updatedTask.taskListId, userId); //TODOTEST if trying to move to tasklist of another user
        if (updatedTask.parentId) await findByIdAndVerifyUser(taskModel, updatedTask.parentId, userId); //TODOTEST if trying to append as subtask to a task of another user
        return await safeUpdateById(taskModel, taskId, updatedTask);
    },

    deleteTaskById: async (userId, taskId) => { //TODOTEST
        await findByIdAndVerifyUser(taskModel, taskId, userId);
        if (Boolean(process.env.dev)) { //PROD: disabling transactions in local
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
