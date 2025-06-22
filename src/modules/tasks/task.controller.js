import taskService from "./task.service.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import successHandler from "../../utils/successHandler.js";

const taskController = {
    getTasks: asyncHandler(async (req, res) => {
        const { userId } = req;
        const tasks = await taskService.getTasks(userId);
        return successHandler(res, { message: "Tasks fetched successfully", tasks })
    }),

    createTask: asyncHandler(async (req, res) => {
        const { userId, body: newTask } = req;
        const createdTask = await taskService.createTask(userId, newTask, taskListId);
        return successHandler(res, { message: "Task created successfully", createdTask })
    }),

    getTaskById: asyncHandler(async (req, res) => {
        const { userId, params: { taskId } } = req;
        const task = await taskService.getTaskById(userId, taskId);
        return successHandler(res, { message: "Task fetched successfully", task })
    }),

    updateTaskById: asyncHandler(async (req, res) => {
        const { userId, params: { taskId }, body: updatedTask } = req;
        await taskService.updateTaskById(userId, taskId, updatedTask);
        return successHandler(res, { message: "Task updated successfully", updatedTask })
    }),

    deleteTaskById: asyncHandler(async (req, res) => {
        const { userId, params: { taskId } } = req;
        await taskService.deleteTaskById(userId, taskId);
        return successHandler(res, { message: "Task deleted successfully" })
    }),

    toggleTaskStatusById: asyncHandler(async (req, res) => {
        const { userId, params: { taskId } } = req;
        await taskService.toggleTaskStatusById(userId, taskId);
        return successHandler(res, { message: "Task status updated successfully" })
    }),
}

export default taskController;
