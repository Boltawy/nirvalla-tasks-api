import { Router } from 'express'
import usersController from './user.controller.js';


const usersRouter = Router();

usersRouter.route('/').get(usersController.getUsers);
usersRouter.route('/:id')
    .get(usersController.getUserById)
    .put(usersController.updateUser)

export default usersRouter