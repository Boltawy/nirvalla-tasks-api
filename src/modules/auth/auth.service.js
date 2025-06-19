import User from "../../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { responseError } from "../../utils/errorHandler.js";

//MIGHTDO: a try/catch wrapper around DB operations 

const authService = {
    signUp: async ({ userName, email, password }) => {
        let user;
        try {
            user = await User.findOne({ email: email })
        } catch {
            throw new responseError(500, "Error fetching user")
        }
        if (user) {
            throw new responseError(409, "User already exists")
        }
        try {
            let hashedPassword = await bcrypt.hash(password, 8)
            await User.insertOne({ userName, email, password: hashedPassword }, { validateBeforeSave: true })
        } catch (error) {
        console.log(error)
            if (error.message.includes("validation failed")) {
                throw new responseError(400, "Validation Error")
            }
            else throw new responseError(520, "Unknown error occured")
        }
    },
    login: async ({ email: loginEmail, password: loginPassword }) => {
        let _id, userName, password, isValidPassword;
        try {
            ({ _doc: { _id, userName, password } } = await User.findOne({ email: loginEmail }));
        } catch (error) {
            // console.log(error)
            throw new responseError(500, "Error fetching user") //Invalid Email, Or other server errors.
        }
        isValidPassword = await bcrypt.compare(loginPassword, password)
        if (!isValidPassword) {
            throw new responseError(404, "Invalid Credentials") //Invalid Password
        }

        const tokenPayload = {
            _id, userName
        }

        const accessToken = jwt.sign(tokenPayload, process.env.JWT_ACCESS_SECRET,
            { expiresIn: "1h" }
        )
        const refreshToken = jwt.sign(tokenPayload, process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        )
        return { _id, userName, accessToken, refreshToken };
    }
}
export default authService
