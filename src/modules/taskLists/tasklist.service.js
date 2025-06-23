import { responseError } from "../../utils/errorHandler.js";
import { safeCreate, safeDeleteById, safeFind, safeFindOne, safeUpdateById, findByIdAndVerifyOwner } from "../../utils/dbSafeUtils.js";
import taskListModel from "../../models/taskList.model.js";
import taskModel from "../../models/task.model.js";

//? findByIdAndUpdate ? Should I use it? Does it apply valiadtion ? 
//* => No by default, But by using "runValidators: true" it does, Implemented in SafeUpdateById
//? When doing write operations, How to prevent user form editing others' data? 
//* => Done.


const taskListService = {
    getTaskLists: async (userId) => {
        return await safeFind(taskListModel, { userId }, { sort: { createdAt: 1 }, projection: { userId: 0, __v: 0, isDefault: 0 } });
    },
    createTaskList: async (userId, taskList) => {
        taskList.userId = userId
        const alreadyExists = await safeFindOne(taskListModel, { title: taskList.title, userId }, { errOnNotFound: false });
        if (alreadyExists) throw new responseError(409, "TaskList with same name already exists");
        return await safeCreate(taskListModel, taskList);
    },
    getTaskListById: async (userId, taskListId) => {
        return await findByIdAndVerifyOwner(taskListModel, taskListId, userId);
    },
    updateTaskListById: async (userId, taskListId, newTaskList) => {
        const taskList = await findByIdAndVerifyOwner(taskListModel, taskListId, userId);
        if (taskList.isDefault == true) throw new responseError(403, `The default 'Inbox' taskList can't be modified`);
        return await safeUpdateById(taskListModel, taskListId, newTaskList);
    },
    deleteTaskListById: async (userId, taskListId) => { //TODO Handle nested tasks
        const taskList = await findByIdAndVerifyOwner(taskListModel, taskListId, userId);
        if (taskList.isDefault == true) throw new responseError(403, `The default 'Inbox' taskList can't be modified`);
        await safeDeleteById(taskListModel, taskListId);
    },

    getTasksByTaskListId: async (userId, taskListId) => {
        await findByIdAndVerifyOwner(taskListModel, taskListId, userId);
        return await safeFind(taskModel, { taskListId, userId });
    },
    createTaskByTaskListId: async (userId, taskListId, newTask) => {
        newTask.taskListId = taskListId;
        newTask.userId = userId;
        await findByIdAndVerifyOwner(taskListModel, taskListId, userId);
        return await safeCreate(taskModel, newTask);
    },

}

export default taskListService

