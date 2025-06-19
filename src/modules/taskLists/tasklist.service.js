import User from "../../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { responseError } from "../../utils/errorHandler.js";
import TaskList from "../../models/tasklist.model.js";

//MIGHTDO: a try/catch wrapper around DB operations 

const taskListService = {
    getTaskLists: async ({ userId }) => {
        console.log(userId)
        const taskLists = await TaskList.find({ "userId": userId });
        return taskLists
    },
    createTaskList: async ({ body: taskList, userId }) => {
        console.log(taskList, userId) // TODO merge tasklist with it's user
        let createdTaskList;
        try {
            console.log(taskList)
            createdTaskList = await TaskList.create(taskList);
        } catch (error) {
            throw new responseError(520, "Unknown error occured", error)
        }
        return createdTaskList
    },
}

export default taskListService
