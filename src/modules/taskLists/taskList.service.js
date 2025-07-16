import { responseError } from "../../utils/errorHandler.js";
import { safeCreate, safeDeleteById, safeFind, safeFindOne, safeUpdateById, findByIdAndVerifyUser } from "../../utils/safeMongoose.js";
import tasklistModel from "../../models/tasklist.model.js";
import taskModel from "../../models/task.model.js";
import { mongo } from "mongoose";

//? findByIdAndUpdate ? Should I use it? Does it apply valiadtion ? 
//* => No by default, But by using "runValidators: true" it does, Implemented in SafeUpdateById
//? When doing write operations, How to prevent user form editing others' data? 
//* => Done.


const tasklistService = {
    getTasklists: async (userId) => {
        return await safeFind(tasklistModel, { userId }, { sort: { createdAt: 1 }, projection: { userId: 0, __v: 0 } });
    },
    createTasklist: async (userId, tasklist) => {
        tasklist.userId = userId
        const alreadyExists = await safeFindOne(tasklistModel, { title: tasklist.title, userId }, { errOnNotFound: false });
        if (alreadyExists) throw new responseError(409, "Tasklist with same name already exists");
        return await safeCreate(tasklistModel, tasklist);
    },
    getTasklistById: async (userId, tasklistId) => {
        return await findByIdAndVerifyUser(tasklistModel, tasklistId, userId);
    },
    updateTasklistById: async (userId, tasklistId, newTasklist) => {
        const tasklist = await findByIdAndVerifyUser(tasklistModel, tasklistId, userId);
        if (tasklist.isDefault == true) throw new responseError(403, `The default 'Inbox' tasklist can't be modified`);
        return await safeUpdateById(tasklistModel, tasklistId, newTasklist);
    },
    deleteTasklistById: async (userId, tasklistId) => { //TODOTEST
        const tasklist = await findByIdAndVerifyUser(tasklistModel, tasklistId, userId);
        if (tasklist.isDefault == true) throw new responseError(403, `The default 'Inbox' tasklist can't be modified`);
        if (Boolean(process.env.dev)) { //PROD: disabling transactions in local
            await safeDeleteById(tasklistModel, tasklistId);
            await safeDelete(taskModel, { tasklistId });
        } else {
            const session = await mongo.startSession();
            session.startTransaction();
            try {
                await tasklistModel.deleteOne({ _id: tasklistId }, { session });
                await taskModel.deleteMany({ tasklistId }, { session });
                await session.commitTransaction();
            } catch (error) {
                await session.abortTransaction();
                throw responseError(500, "Error deleting tasklist", error);
            }
            finally {
                session.endSession();
            }
        }
    },

    getTasksByTasklistId: async (userId, tasklistId) => {
        await findByIdAndVerifyUser(tasklistModel, tasklistId, userId);
        return await safeFind(taskModel, { tasklistId, userId });
    },
    createTaskByTasklistId: async (userId, tasklistId, newTask) => {
        newTask.tasklistId = tasklistId;
        newTask.userId = userId;
        await findByIdAndVerifyUser(tasklistModel, tasklistId, userId);
        return await safeCreate(taskModel, newTask);
    },

}

export default tasklistService

