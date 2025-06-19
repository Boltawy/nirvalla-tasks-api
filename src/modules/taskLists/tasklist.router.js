import { Router } from 'express'
import taskListController from './tasks.controller.js';



const taskListRouter = Router();

taskListRouter.route('/')
    .get(taskListController.getTaskLists)
    .post(taskListController.createTaskList)
taskListRouter.route('/:id')
    .get(taskListController.getTaskListById)
    .patch(taskListController.updateTaskListById)
    .delete(taskListController.deleteTaskListById);
taskListRouter.route('/:id/tasks')
    .post(taskListController.createTaskByTaskListId)
// .get(taskListController.getTasksByTaskListId)
// taskListRouter.route('/:id/tasks/:id').get(taskListController.getTaskByIdByTaskListId);

export default taskListRouter