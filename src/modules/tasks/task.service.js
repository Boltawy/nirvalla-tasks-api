import taskModel from "../../models/task.model.js";
import tasklistModel from "../../models/tasklist.model.js";
import { safeCreate, safeDelete, safeDeleteById, safeFind, safeFindById, safeFindOne, safeUpdateById } from "../../utils/dbSafeUtils.js";

const taskService = {
    getTasks: async (userId) => {
        const tasks = await safeFind(taskModel, { userId });
        return tasks
    },

    createTask: async (userId, newTask) => {
        const { _id: taskListId } = await safeFindOne(tasklistModel, { isDefault: true });
        newTask.userId = userId;
        newTask.taskListId = taskListId;
        const createdTask = await safeCreate(taskModel, newTask);
        return createdTask
    },

    getTaskById: async (userId, taskId) => {
        const task = await safeFindById(taskModel, taskId);
        if (task.userId != userId) throw new responseError(403, "Unauthorized: You don't have access to that resource");
        return task
    },

    // updateTaskById: async (userId, taskId, updatedTask) => {
    //     const task = await safeFindById(taskModel, taskId);
    //     if (task.userId != userId) throw new responseError(403, "Unauthorized: You don't have access to that resource");
    //     const updatedTask = await safeUpdateById(taskModel, taskId, updatedTask);
    //     return updatedTask
    // },

//     deleteTaskById: async (userId, taskId) => {
//         const task = await safeFindById(taskModel, taskId);
//         if (task.userId != userId) throw new responseError(403, "Unauthorized: You don't have access to that resource");
//         await safeDeleteById(taskModel, taskId);
//     },

//     toggleTaskStatusById: async (userId, taskId) => {
//         const task = await safeFindById(taskModel, taskId);
//         if (task.userId != userId) throw new responseError(403, "Unauthorized: You don't have access to that resource");
//         const updatedTask = await safeUpdateById(taskModel, taskId, { isCompleted: !task.isCompleted });
//         return updatedTask
//     }
}

export default taskService
