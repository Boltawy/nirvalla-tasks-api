import { Router } from 'express'
import taskListController from './tasklist.controller.js';
import { validate } from '../../middleware/validation.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { taskListSchema } from '../../middleware/validationSchemas.js';



const taskListRouter = Router();

taskListRouter.route('/')
    .get(authenticate, taskListController.getTaskLists)
    .post(authenticate, validate(taskListSchema), taskListController.createTaskList)
taskListRouter.route('/:taskListId')
    .get(authenticate, taskListController.getTaskListById)
    .patch(authenticate, validate(taskListSchema), taskListController.updateTaskListById)
    .delete(authenticate, taskListController.deleteTaskListById);
// taskListRouter.route('/:taskListId/tasks')
//     .post(authenticate, taskListController.createTaskByTaskListId)
//     .get(authenticate, taskListController.getTasksByTaskListId)
// taskListRouter.route('/:taskListId/tasks/:taskId').get(authenticate, taskListController.getTaskByIdByTaskListId);

export default taskListRouter