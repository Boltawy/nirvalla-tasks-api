import syncService from "./sync.service.js";
import successHandler from "../../utils/successHandler.js";
import { assignIds } from "../../utils/utils.js";

const syncController = {
    getPopulatedLists: async (req, res) => {
        const { userId } = req;
        const populatedLists = await syncService.populateLists(userId);
        return successHandler(res, { message: "Populated lists fetched successfully", populatedLists })
    },
    syncToServer: async (req, res) => {
        const { body: { populatedLists }, userId } = req;
        const { tasklists: sentTasklists, tasks: sentTasks } = await syncService.depopulateLists(populatedLists);
        const tasks = await assignIds(sentTasks);
        const taskLists = await assignIds(sentTasklists);
        await syncService.forcePush(userId, taskLists, tasks); //TODO Implement a smarter sync algorithm
        // await syncService.InvalidateAndUpdate(sentTasklists, sentTasks);
        return successHandler(res, { message: "Sync to server successfully" })
    }
}

export default syncController;
