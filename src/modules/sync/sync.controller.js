import syncService from "./sync.service.js";
import successHandler from "../../utils/successHandler.js";

const syncController = {
    getPopulatedLists: async (req, res) => {
        const { userId } = req;
        const populatedLists = await syncService.populateLists(userId);
        return successHandler(res, { message: "Populated lists fetched successfully", populatedLists })
    },
    syncToServer: async (req, res) => {
        const { userId, body: newPopulatedLists } = req;
        const populatedLists = await syncService.populateLists(userId);
        await syncService.diffAndUpdate(userId, populatedLists, newPopulatedLists);
        return successHandler(res, { message: "Sync to server successfully"})
    }
}

export default syncController;
