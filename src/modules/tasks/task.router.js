import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { taskSchema, taskUpdateSchema } from "../../middleware/validationSchemas.js";
import taskController from "./task.controller.js";
import { validate } from "../../middleware/validation.middleware.js";

const taskRouter = Router();

taskRouter.route('/')
    .get(authenticate, taskController.getTasks)
    .post(authenticate, validate(taskSchema), taskController.createTask);

taskRouter.route('/:taskId')
    .get(authenticate, taskController.getTaskById)
    .put(authenticate, validate(taskUpdateSchema), taskController.updateTaskById)
    .delete(authenticate, taskController.deleteTaskById)
taskRouter.route('/:taskId/subtasks')
    .get(authenticate, taskController.getSubtasksByTaskId)
taskRouter.route('/:taskId/complete') //MIGHTDO: Add other single-action routes like this one
    .patch(authenticate, taskController.toggleTaskCompletionById);

export default taskRouter
