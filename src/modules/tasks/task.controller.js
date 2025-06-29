import taskService from "./task.service.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import successHandler from "../../utils/successHandler.js";

const taskController = {
    getTasks: async (req, res) => {
        const { userId } = req;
        const tasks = await taskService.getTasks(userId, req.query);
        return successHandler(res, { message: "Tasks fetched successfully", tasks })
    },

    createTask: async (req, res) => {
        const { userId, body: newTask } = req;
        const createdTask = await taskService.createTask(userId, newTask);
        return successHandler(res, { message: "Task created successfully", createdTask })
    },

    getTaskById: async (req, res) => {
        const { userId, params: { taskId } } = req;
        const task = await taskService.getTaskById(userId, taskId);
        return successHandler(res, { message: "Task fetched successfully", task })
    },

    updateTaskById: async (req, res) => {
        const { userId, params: { taskId }, body: updatedTask } = req;
        await taskService.updateTaskById(userId, taskId, updatedTask);
        return successHandler(res, { message: "Task updated successfully", updatedTask })
    },

    deleteTaskById: async (req, res) => {
        const { userId, params: { taskId } } = req;
        await taskService.deleteTaskById(userId, taskId);
        return successHandler(res, { message: "Task deleted successfully" })
    },

    toggleTaskCompletionById: async (req, res) => {
        const { userId, params: { taskId } } = req;
        const task = await taskService.toggleTaskCompletionById(userId, taskId);
        return successHandler(res, { message: "Changed completion status successfully", task })
    },

    getSubtasksByTaskId: async (req, res) => {
        const { userId, params: { taskId } } = req;
        const subtasks = await taskService.getSubtasksByTaskId(userId, taskId);
        return successHandler(res, { message: "Subtasks fetched successfully", subtasks })
    },
}

export default taskController;
