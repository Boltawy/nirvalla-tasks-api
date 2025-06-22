import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { taskSchema } from "../../middleware/validationSchemas.js";
import taskController from "./task.controller.js";
import { validate } from "../../middleware/validation.middleware.js";

const taskRouter = Router();

taskRouter.route('/')
    .get(authenticate, taskController.getTasks)
    .post(authenticate, validate(taskSchema), taskController.createTask);

taskRouter.route('/:taskId')
    .get(authenticate, taskController.getTaskById)
    .put(authenticate, validate(taskSchema), taskController.updateTaskById)
    .delete(authenticate, taskController.deleteTaskById)
    .patch(authenticate, taskController.toggleTaskStatusById);


export default taskRouter
