import taskListService from "./tasklist.service.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import successHandler from "../../utils/successHandler.js";

const taskListController = {
    getTaskLists: asyncHandler(async (req, res) => {
        const { userId } = req;
        const taskLists = await taskListService.getTaskLists(userId);
        return successHandler(res, taskLists)
    }),

    createTaskList: asyncHandler(async (req, res) => {
        const { userId, body: taskList } = req;
        const createdTaskList = await taskListService.createTaskList(userId, taskList);
        return successHandler(res, createdTaskList)
    }),

    getTaskListById: asyncHandler(async (req, res) => {
        const { userId, params: { taskListId } } = req;
        const taskList = await taskListService.getTaskListById(userId, taskListId);
        return successHandler(res, { message: "Task list fetched successfully", taskList })
    }),

    updateTaskListById: asyncHandler(async (req, res) => {
        const { userId, params: { taskListId }, body: taskList } = req;
        await taskListService.updateTaskListById(userId, taskListId, taskList);
        return successHandler(res, { message: "Task list updated successfully", taskList })
    }),

    deleteTaskListById: asyncHandler(async (req, res) => {
        const { userId, params: { taskListId } } = req;
        await taskListService.deleteTaskListById(userId, taskListId);
        return successHandler(res, { message: "Task list deleted successfully" })
    }),

    // createTaskByTaskListId: asyncHandler(async (req, res) => {
    //     const createdTask = await taskListService.createTaskByTaskListId(req.params.id, req.body);
    //     return successHandler(res, { message: "Task created successfully", createdTask })
    // }),
}

export default taskListController;
