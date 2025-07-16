import userModel from "../../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { responseError } from "../../utils/errorHandler.js";
import { safeCreate, safeFindOne } from "../../utils/safeMongoose.js";
import tasklistModel from "../../models/tasklist.model.js";
import mongoose from "mongoose";


const authService = {
    signUp: async (userName, email, password) => {
        const user = await safeFindOne(userModel, { email }, { errOnNotFound: false })
        if (user) throw new responseError(409, "A user already exists with given email")
        const hashedPassword = await bcrypt.hash(password, 8)
        if (Boolean(process.env.dev)) { //PROD: disabling transactions in local
            const { _id: userId } = await safeCreate(userModel, { userName, email, password: hashedPassword });
            await safeCreate(tasklistModel, { userId, title: "Inbox", isDefault: true })
        } else {
            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                const result = await userModel.create([{ userName, email, password: hashedPassword }], { session });
                const { _id: userId } = result[0];
                await tasklistModel.create([{ userId, title: "Inbox", isDefault: true }], { session });
                await session.commitTransaction();
            } catch (error) {
                await session.abortTransaction();
                throw new responseError(500, "Error creating user", error);
            } finally {
                session.endSession();
            }
        }
    },
    // signUp: async (userName, email, password) => {
    //     const user = await safeFindOne(userModel, { email }, { errOnNotFound: false })
    //     if (user) throw new responseError(409, "A user already exists with given email")
    //     const hashedPassword = await bcrypt.hash(password, 8)
    //     try {
    //         const result = await userModel.create([{ userName, email, password: hashedPassword }]);
    //         console.log(result[0])
    //         await tasklistModel.create([{ userId, title: "Inbox", isDefault: true }]);
    //     } catch (error) {
    //         throw new responseError(500, "Error creating user", error);
    //     }
    // },

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
    },

    gmailLogin: async (loginEmail, loginPassword) => {
        
    },
}
export default authService
