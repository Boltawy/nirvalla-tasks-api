import usersModel from "../../models/user.model.js";

const authService = {
    signUp: async (firstName, lastName, email, password) => {
        let user = await usersModel.findOne({ email: email })
        if (user) {
            throw new Error("User already exists")
        }
        await usersModel.insertOne({ firstName, lastName, email, password })
    },
    login: async (email, password) => {
        let user = await usersModel.findOne({ email: email, password: password }, { projection: { password: 0 } })
        if (!user) {
            throw new Error("User not found")
        }
        return user
    }
}

export default authService