import tasklistService from "./tasklist.service.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import successHandler from "../../utils/successHandler.js";

const tasklistController = {
    getTasklists: async (req, res) => {
        const { userId } = req;
        const tasklists = await tasklistService.getTasklists(userId);
        return successHandler(res, { message: "Task lists fetched successfully", tasklists })
    },

    createTasklist: async (req, res) => {
        const { userId, body: tasklist } = req;
        const createdTasklist = await tasklistService.createTasklist(userId, tasklist);
        return successHandler(res, { message: "Task list created successfully", createdTasklist })
    },

    getTasklistById: async (req, res) => {
        const { userId, params: { tasklistId } } = req;
        const tasklist = await tasklistService.getTasklistById(userId, tasklistId);
        return successHandler(res, { message: "Task list fetched successfully", tasklist })
    },

    updateTasklistById: async (req, res) => {
        const { userId, params: { tasklistId }, body: tasklist } = req;
        await tasklistService.updateTasklistById(userId, tasklistId, tasklist);
        return successHandler(res, { message: "Task list updated successfully", tasklist })
    },

    deleteTasklistById: async (req, res) => {
        const { userId, params: { tasklistId } } = req;
        await tasklistService.deleteTasklistById(userId, tasklistId);
        return successHandler(res, { message: "Task list deleted successfully" })
    },

    createTaskByTasklistId: async (req, res) => {
        const { userId, params: { tasklistId }, body: newTask } = req;
        const createdTask = await tasklistService.createTaskByTasklistId(userId, tasklistId, newTask);
        return successHandler(res, { message: "Task created successfully", createdTask })
    },

    getTasksByTasklistId: async (req, res) => {
        const { userId, params: { tasklistId } } = req;
        const tasks = await tasklistService.getTasksByTasklistId(userId, tasklistId);
        return successHandler(res, { message: "Tasks fetched successfully", tasks })
    },
}

export default tasklistController;
