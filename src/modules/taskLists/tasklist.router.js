    import { Router } from 'express'
import taskListController from './taskList.controller.js';
import { validate } from '../../middleware/validation.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { taskListSchema, taskSchema } from '../../middleware/validationSchemas.js';



const taskListRouter = Router();

taskListRouter.route('/')
    .get(authenticate, taskListController.getTaskLists)
    .post(authenticate, validate(taskListSchema), taskListController.createTaskList);
taskListRouter.route('/:taskListId')
    .get(authenticate, taskListController.getTaskListById)
    .patch(authenticate, validate(taskListSchema), taskListController.updateTaskListById)
    .delete(authenticate, taskListController.deleteTaskListById);
taskListRouter.route('/:taskListId/tasks')
    .get(authenticate, taskListController.getTasksByTaskListId)
    .post(authenticate, validate(taskSchema), taskListController.createTaskByTaskListId);

export default taskListRouter