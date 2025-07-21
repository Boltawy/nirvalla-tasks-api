import { Router } from 'express'
import authController from './auth.controller.js';
import { validate } from '../../middleware/validation.middleware.js';
import { signupSchema, loginSchema } from '../../middleware/validationSchemas.js';
import passport from 'passport';
import { googleStrategy, githubStrategy } from '../../middleware/passport.middleware.js'


const authRouter = Router();

authRouter.route('/signup').post(validate(signupSchema), authController.signUp);
authRouter.route('/login').post(validate(loginSchema), authController.login);
authRouter.route('/google').get(passport.authenticate('google', { scope: ['profile', 'email'] }));
authRouter.route('/google/redirect').get(passport.authenticate('google', { session: false }), authController.googleAuth);
authRouter.route('/github').get(passport.authenticate('github', { scope: ['profile', 'email'] }));
authRouter.route('/github/redirect').get(passport.authenticate('github', { session: false }), authController.githubAuth);

export default authRouter