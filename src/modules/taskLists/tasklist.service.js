import User from "../../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { responseError } from "../../utils/errorHandler.js";
import TaskList from "../../models/tasklist.model.js";
import { safeCreate, safeFind, safeFindOne, safeFindOneById } from "../../utils/dbSafeUtils.js";
import tasklistModel from "../../models/tasklist.model.js";

//MIGHTDO: a try/catch wrapper around DB operations 

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
    getTaskListById: async ({ params: { id } }) => {
        const taskList = await safeFindOneById(tasklistModel, id);
        return taskList
    },
    updateTaskListById: async ({ params: { id }, body: taskList }) => {
        await safeFindOneById(tasklistModel, id);
        // await safeCreate(tasklistModel, taskList);
    },
    // deleteTaskListById: async ({ params: { id } }) => {
    //     await safeFindOne(tasklistModel, { _id: id });
    //     await safeDelete(tasklistModel, { _id: id });
    // },

}

export default taskListService
