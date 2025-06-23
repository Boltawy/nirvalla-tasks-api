import taskModel from "../../models/task.model.js";
import taskListModel from "../../models/taskList.model.js";
import { safeCreate, safeDelete, safeDeleteById, safeFind, safeFindById, safeFindOne, safeUpdateById } from "../../utils/dbSafeUtils.js";
import { taskListSchema } from "../../middleware/validationSchemas.js";
import { responseError } from "../../utils/errorHandler.js";

const taskService = {
    getTasks: async (userId) => {
        const tasks = await safeFind(taskModel, { userId });
        return tasks
    },
    //STEP
    /*
    Handle if taskListId is provided and :
        1. is not valid
        2. does not belong to the user
    handle If taskListId is not provided but taskListTitle is and:
        1. is not valid
        2. no matching taskList
        3. does not belong to the user
    handle if neither taskListId nor taskListTitle is provided:
        1. add to "inbox" taskList
    
    
    
    */
    createTask: async (userId, newTask) => { //* Bloated logic
        newTask.userId = userId;
        let fetchedTaskList
        const { taskListId, taskListTitle } = newTask;
        if (taskListId) {
            fetchedTaskList = await safeFindById(taskListModel, taskListId);
            if (fetchedTaskList.userId != userId) throw new responseError(403, "Unauthorized: You don't have access to that resource");
        }
        else if (!taskListId && taskListTitle) {
            fetchedTaskList = await safeFindOne(taskListModel, { title: taskListTitle, userId }, { errOnNotFound: false });
            if (!fetchedTaskList) {
                fetchedTaskList = await safeCreate(taskListModel, { title: taskListTitle, userId });
            }
        } else if (!taskListId && !taskListTitle) {
            fetchedTaskList = await safeFindOne(taskListModel, { userId, isDefault: true });
        } else throw new responseError(500, "Unhandled error")

        const { _id: fetchedTaskListId } = fetchedTaskList;
        newTask.taskListId = fetchedTaskListId;
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
