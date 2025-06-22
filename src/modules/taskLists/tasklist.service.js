import User from "../../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { responseError } from "../../utils/errorHandler.js";
import TaskList from "../../models/tasklist.model.js";
import { safeCreate, safeFind, safeFindById, safeFindOne, safeUpdateById } from "../../utils/dbSafeUtils.js";
import tasklistModel from "../../models/tasklist.model.js";

//? findByIdAndUpdate/Delete ? Should I use it? Does it apply valiadtion ?
//? When doing write operations, How to prevent user form editing others' data?

const taskListService = {
    getTaskLists: async (userId) => {
        const taskLists = await safeFind(tasklistModel, { userId });
        return taskLists
    },
    createTaskList: async (userId, taskList) => {
        taskList.userId = userId
        const createdTaskList = await safeCreate(tasklistModel, taskList);
        return createdTaskList
    },
    getTaskListById: async (userId, taskListId) => {
        const taskList = await safeFindById(tasklistModel, taskListId);
        if (taskList.userId != userId) throw new responseError(403, "Forbidden");
        return taskList
    },
    updateTaskListById: async (userId, taskListId, newTaskList) => {
        const taskList = await safeUpdateById(tasklistModel, taskListId, newTaskList);
        console.log(taskList)
        if (taskList.userId != userId) throw new responseError(403, "Forbidden");
        return taskList
    },
    deleteTaskListById: async (userId, taskListId) => {
        const taskList = await safeFindById(tasklistModel, taskListId);
        if (taskList.userId != userId) throw new responseError(403, "Forbidden");
        await safeDeleteById(tasklistModel, taskListId);
    },

}

export default taskListService
