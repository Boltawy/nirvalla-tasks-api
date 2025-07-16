    import { Router } from 'express'
import { validate } from '../../middleware/validation.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { tasklistSchema, taskSchema } from '../../middleware/validationSchemas.js';
import tasklistController from './taskList.controller.js';



const tasklistRouter = Router();

tasklistRouter.route('/')
    .get(authenticate, tasklistController.getTasklists)
    .post(authenticate, validate(tasklistSchema), tasklistController.createTasklist);
tasklistRouter.route('/:tasklistId')
    .get(authenticate, tasklistController.getTasklistById)
    .patch(authenticate, validate(tasklistSchema), tasklistController.updateTasklistById)
    .delete(authenticate, tasklistController.deleteTasklistById);
tasklistRouter.route('/:tasklistId/tasks')
    .get(authenticate, tasklistController.getTasksByTasklistId)
    .post(authenticate, validate(taskSchema), tasklistController.createTaskByTasklistId);

export default tasklistRouter
