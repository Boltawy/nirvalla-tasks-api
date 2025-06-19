import User from "../../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { responseError } from "../../utils/errorHandler.js";
import TaskList from "../../models/tasklist.model.js";
import { safeCreate, safeFind, safeFindOne } from "../../utils/dbutils/dbSafeUtils.js";
import tasklistModel from "../../models/tasklist.model.js";

//MIGHTDO: a try/catch wrapper around DB operations 

const taskListService = {
    getTaskLists: async ({ userId }) => {
        const taskLists = await safeFind(tasklistModel, { userId });
        return taskLists
    },
    createTaskList: async ({ body: taskList, userId }) => {
        taskList.userId = userId
        const createdTaskList = await safeCreate(tasklistModel, taskList);
        return createdTaskList
    },
}

export default taskListService
