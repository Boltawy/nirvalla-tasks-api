import User from "../../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { responseError } from "../../utils/errorHandler.js";
import TaskList from "../../models/taskList.model.js";
import { safeCreate, safeDelete, safeDeleteById, safeFind, safeFindById, safeFindOne, safeUpdateById } from "../../utils/dbSafeUtils.js";
import taskListModel from "../../models/taskList.model.js";

//? findByIdAndUpdate ? Should I use it? Does it apply valiadtion ? 
//* => No by default, But by using "runValidators: true" it does.
//? When doing write operations, How to prevent user form editing others' data? 
//* => Done.

const taskListService = {
    getTaskLists: async (userId) => {
        const taskLists = await safeFind(taskListModel, { userId });
        return taskLists
    },
    createTaskList: async (userId, taskList) => {
        taskList.userId = userId
        const createdTaskList = await safeCreate(taskListModel, taskList);
        return createdTaskList
    },
    getTaskListById: async (userId, taskListId) => {
        const taskList = await safeFindById(taskListModel, taskListId);
        if (taskList.userId != userId) throw new responseError(403, "Unauthorized: You don't have access to that resource");
        return taskList
    },
    updateTaskListById: async (userId, taskListId, newTaskList) => {
        const taskList = await safeFindById(taskListModel, taskListId);
        if (taskList.isDefault == true) throw new responseError(403, `The default 'Inbox' taskList can't be modified`)
        if (taskList.userId != userId) throw new responseError(403, "Unauthorized: You don't have access to that resource");
        const updatedTasklist = await safeUpdateById(taskListModel, taskListId, newTaskList);
        return updatedTasklist;
    },
    deleteTaskListById: async (userId, taskListId) => {
        const taskList = await safeFindById(taskListModel, taskListId);
        if (taskList.isDefault == true) throw new responseError(403, `The default 'Inbox' taskList can't be modified`)
        if (taskList.userId != userId) throw new responseError(403, "Unauthorized: You don't have access to that resource");
        await safeDeleteById(taskListModel, taskListId);
    },

    getTasksByTaskListId: async (userId, taskListId) => {
        const taskList = await safeFindById(taskListModel, taskListId);
        if (taskList.userId != userId) throw new responseError(403, "Unauthorized: You don't have access to that resource");
        const tasks = await safeFind(taskModel, { taskListId, userId });
        return tasks
    },
    createTaskByTaskListId: async (userId, taskListId, newTask) => {
        newTask.taskListId = taskListId;
        newTask.userId = userId;
        const taskList = await safeFindById(taskListModel, taskListId);
        if (taskList.userId != userId) throw new responseError(403, "Unauthorized: You don't have access to that resource");
        const createdTask = await safeCreate(taskModel, newTask);
        return createdTask
    },

}

export default taskListService
