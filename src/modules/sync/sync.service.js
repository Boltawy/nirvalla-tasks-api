import { responseError } from "../../utils/errorHandler.js";
import { safeCreate, safeDeleteById, safeFind, safeFindOne, safeUpdateById, findByIdAndVerifyUser } from "../../utils/dbSafeUtils.js";
import taskListModel from "../../models/taskList.model.js";
import taskModel from "../../models/task.model.js";



const syncService = {
    populateLists: async (userId) => {
        const taskLists = await safeFind(taskListModel, { userId, deletedAt: null }, { sort: { createdAt: 1 }, projection: { userId: 0, __v: 0 }, lean: true });
        const tasks = await safeFind(taskModel, { userId, deletedAt: null, completedAt: null }, { sort: { createdAt: 1 }, projection: { userId: 0, __v: 0 }, lean: true });
        taskLists.forEach((list) => {
            Object.assign(list, { tasks: [] })
        })
        tasks.forEach((task) => {
            Object.assign(task, { subtasks: [] })
        })
        for (const task of tasks) {
            if (task.parentId) tasks.find((parentTask) => parentTask._id.toString() == task.parentId.toString()).subtasks.push(task);
            taskLists.find((list) => list._id.toString() == task.taskListId.toString()).tasks.push(task);
        }
        return taskLists;
    }
}

export default syncService

