import { db } from "../../DB/db.connection.js";
import { ObjectId } from "mongodb";
import usersModel from "../../models/user.model.js";

const usersService = {
    getAllUsers: async () => {
        const results = await usersModel.find().toArray();
        return results;
    },
    getUserById: async (id) => {
        const results = await usersModel.findOne({ _id: new ObjectId(id) })
        console.log(results);
        return results;
    },

    updateUser: async (id, userData) => {
        const user = await usersModel.findOne({ _id: new ObjectId(id) })
        if (!user) return null
        const results = await usersModel.updateOne({ _id: new ObjectId(id) }, {$set: { ...userData }})
        return results;
    }
}

export default usersService