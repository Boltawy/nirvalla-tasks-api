import { Router } from 'express'
import authController from './auth.controller.js';


const authRouter = Router();

authRouter.route('/signup').post(authController.signUp);
authRouter.route('/login').post(authController.login);

export default authRouter