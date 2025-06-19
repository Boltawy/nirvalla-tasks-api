import { Router } from 'express'
import authController from './task.controller.js';
import { validate } from '../../middleware/validation.middleware.js';
import { signupSchema, loginSchema } from '../../middleware/validationSchemas.js';


const authRouter = Router();

authRouter.route('/signup').post(validate(signupSchema), authController.signUp);
authRouter.route('/login').post(validate(loginSchema), authController.login);

export default authRouter