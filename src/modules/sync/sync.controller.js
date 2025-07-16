import syncService from "./sync.service.js";
import successHandler from "../../utils/successHandler.js";
import { assignIds } from "../../utils/utils.js";
import mongoose, { isValidObjectId } from "mongoose";

const syncController = {
    getPopulatedLists: async (req, res) => {
        const { userId } = req;
        const populatedLists = await syncService.generatePopulatedLists(userId);
        return successHandler(res, { message: "Populated lists fetched successfully", populatedLists })
    },
    syncToServer: async (req, res) => {
        const { body: { populatedLists }, userId } = req;
        const listsWithValidIds = syncService.generateMongoIds(populatedLists);
        const { tasklists, tasks } = await syncService.depopulateLists(listsWithValidIds);
        await syncService.forcePush(userId, tasklists, tasks); //TODO Implement a smarter sync algorithm
        return successHandler(res, { message: "Sync to server successful" })
    }
}

export default syncController;
