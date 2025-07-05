import { Router } from 'express'
import syncController from './sync.controller.js';
import { validate } from '../../middleware/validation.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { populatedListArraySchema } from '../../middleware/validationSchemas.js';



const syncRouter = Router();

syncRouter.route('/')
    .get(authenticate, syncController.getPopulatedLists)
    .post(authenticate, syncController.syncToServer) //TODO Validate on populatedListArray


export default syncRouter
