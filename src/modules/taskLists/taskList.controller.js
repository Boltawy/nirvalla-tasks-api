import taskListService from "./taskList.service.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import successHandler from "../../utils/successHandler.js";

const taskListController = {
    getTaskLists: async (req, res) => {
        const { userId } = req;
        const taskLists = await taskListService.getTaskLists(userId);
        return successHandler(res, { message: "Task lists fetched successfully", taskLists })
    },

    createTaskList: async (req, res) => {
        const { userId, body: taskList } = req;
        const createdTaskList = await taskListService.createTaskList(userId, taskList);
        return successHandler(res, { message: "Task list created successfully", createdTaskList })
    },

    getTaskListById: async (req, res) => {
        const { userId, params: { taskListId } } = req;
        const taskList = await taskListService.getTaskListById(userId, taskListId);
        return successHandler(res, { message: "Task list fetched successfully", taskList })
    },

    updateTaskListById: async (req, res) => {
        const { userId, params: { taskListId }, body: taskList } = req;
        await taskListService.updateTaskListById(userId, taskListId, taskList);
        return successHandler(res, { message: "Task list updated successfully", taskList })
    },

    deleteTaskListById: async (req, res) => {
        const { userId, params: { taskListId } } = req;
        await taskListService.deleteTaskListById(userId, taskListId);
        return successHandler(res, { message: "Task list deleted successfully" })
    },

    createTaskByTaskListId: async (req, res) => {
        const { userId, params: { taskListId }, body: newTask } = req;
        const createdTask = await taskListService.createTaskByTaskListId(userId, taskListId, newTask);
        return successHandler(res, { message: "Task created successfully", createdTask })
    },

    getTasksByTaskListId: async (req, res) => {
        const { userId, params: { taskListId } } = req;
        const tasks = await taskListService.getTasksByTaskListId(userId, taskListId);
        return successHandler(res, { message: "Tasks fetched successfully", tasks })
    },
}

export default taskListController;
