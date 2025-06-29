import userModel from "../../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { responseError } from "../../utils/errorHandler.js";
import { safeCreate, safeFindOne } from "../../utils/dbSafeUtils.js";
import taskListModel from "../../models/taskList.model.js";


const authService = {
    signUp: async (userName, email, password) => {
        const user = await safeFindOne(userModel, { email }, { errOnNotFound: false })
        if (user) throw new responseError(409, "A user already exists with given email")
        const hashedPassword = await bcrypt.hash(password, 8)
        const { _id: userId } = await safeCreate(userModel, { userName, email, password: hashedPassword }) //TODO: Atomic transaction: creating user and taskList together or they both fail
        await safeCreate(taskListModel, { userId, title: "Inbox", isDefault: true })
    },

    login: async (loginEmail, loginPassword) => {
        const result = await safeFindOne(userModel, { email: loginEmail },); //Invalid Email, Or other server errors.
        const { _id, userName, password } = result
        const isValidPassword = await bcrypt.compare(loginPassword, password)
        if (!isValidPassword) {
            throw new responseError(404, "Invalid credentials") //Invalid Password
        }

        const tokenPayload = {
            _id, userName
        }

        const accessToken = jwt.sign(tokenPayload, process.env.JWT_ACCESS_SECRET,
            { expiresIn: "365d" } //PROD: 1h
        )
        const refreshToken = jwt.sign(tokenPayload, process.env.JWT_REFRESH_SECRET,
            { expiresIn: "365d" }
        )
        return { _id, userName, accessToken, refreshToken };
    }
}
export default authService
