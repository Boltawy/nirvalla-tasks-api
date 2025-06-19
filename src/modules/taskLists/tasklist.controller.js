import taskListService from "./tasklist.service.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import successHandler from "../../utils/successHandler.js";

const taskListController = {
    getTaskLists: asyncHandler(async (req, res) => {
        const taskLists = await taskListService.getTaskLists(req);
        return successHandler(res, taskLists)
    }),

    createTaskList: asyncHandler(async (req, res) => {
        const createdTaskList = await taskListService.createTaskList(req);
        return successHandler(res, createdTaskList)
    }),
    // getTaskListById: asyncHandler(async (req, res) => {
    //     const taskList = await taskListService.getTaskListById(req.params.id);
    //     return successHandler(res, { message: "Task list fetched successfully", taskList })
    // }),
    // updateTaskListById: asyncHandler(async (req, res) => {
    //     await taskListService.updateTaskListById(req.params.id, req.body);
    //     return successHandler(res, { message: "Task list updated successfully" })
    // }),
    // deleteTaskListById: asyncHandler(async (req, res) => {
    //     await taskListService.deleteTaskListById(req.params.id);
    //     return successHandler(res, { message: "Task list deleted successfully" })
    // }),
    // createTaskByTaskListId: asyncHandler(async (req, res) => {
    //     const createdTask = await taskListService.createTaskByTaskListId(req.params.id, req.body);
    //     return successHandler(res, { message: "Task created successfully", createdTask })
    // }),
}

export default taskListController;
