import userModel from "../../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { responseError } from "../../utils/errorHandler.js";
import { safeFindOne } from "../../utils/dbSafeUtils.js";

//DONE: a try/catch wrapper around DB operations 

const authService = {
    signUp: async (userName, email, password) => {
        const user = await safeFindOne(userModel, { email }, "User already exists")
        if (user) {
            throw new responseError(409, "User already exists")
        }
        const hashedPassword = await bcrypt.hash(password, 8)

        try {
            await userModel.insertOne({ userName, email, password: hashedPassword }, { validateBeforeSave: true })
        } catch (error) {
            console.log(error)
            if (error.message.includes("validation failed")) {
                throw new responseError(400, "Validation Error")
            }
            else throw new responseError(520, "Unknown error occured")
        }
    },
    login: async (loginEmail, loginPassword) => {
        const result = await safeFindOne(userModel, { email: loginEmail }, "Error fetching user"); //Invalid Email, Or other server errors.
        if (!result) {
            throw new responseError(404, "Invalid credentials") //User not found
        }
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
