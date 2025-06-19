import { Router } from 'express'
import authController from './auth.controller.js';
import { signupSchema, loginSchema, validate } from '../../middleware/validation.middleware.js';


const authRouter = Router();

authRouter.route('/signup').post(validate(signupSchema), authController.signUp);
authRouter.route('/login').post(validate(loginSchema), authController.login);

export default authRouter