import userModel from "../../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { responseError } from "../../utils/errorHandler.js";
import { safeCreate, safeFindOne } from "../../utils/safeMongoose.js";


const localUtils = {
    signJWT: (_id, userName) => {
        const tokenPayload = {
            _id, userName
        }

        const accessToken = jwt.sign(tokenPayload, process.env.JWT_ACCESS_SECRET,
            { expiresIn: Boolean(process.env.DEV) ? "365d" : "1h" } //PROD: 1h
        )
        const refreshToken = jwt.sign(tokenPayload, process.env.JWT_REFRESH_SECRET,
            { expiresIn: "365d" }
        )
        return { accessToken, refreshToken }
    }
}


const authService = {
    signUp: async (userName, email, password) => {
        const user = await safeFindOne(userModel, { email }, { errOnNotFound: false })
        if (user) throw new responseError(409, "A user already exists with given email")
        const hashedPassword = await bcrypt.hash(password, 8)
        await safeCreate(userModel, { userName, email, password: hashedPassword });
        const newUser = await safeFindOne(userModel, { email })
        const { accessToken, refreshToken } = localUtils.signJWT(newUser._id, newUser.userName);
        return { _id: newUser._id, userName, accessToken, refreshToken };
    },

    login: async (loginEmail, loginPassword) => {
        const result = await safeFindOne(userModel, { email: loginEmail },); //Invalid Email, Or other server errors.
        const { _id, userName, password } = result
        const isValidPassword = await bcrypt.compare(loginPassword, password)
        if (!isValidPassword) {
            throw new responseError(404, "Invalid credentials") //Invalid Password
        }

        const { accessToken, refreshToken } = localUtils.signJWT(_id, userName);
        return { _id, userName, accessToken, refreshToken };
    },

    signUpOrLogin: async (userName, email, avatar) => {
        let user = await safeFindOne(userModel, { email }, { errOnNotFound: false })
        if (user) {
            const { accessToken, refreshToken } = localUtils.signJWT(user._id, user.userName);
            return { _id: user._id, userName, accessToken, refreshToken };
        }
        await safeCreate(userModel, { userName, email, avatar })
        user = await safeFindOne(userModel, { email })
        const { accessToken, refreshToken } = localUtils.signJWT(user._id, user.userName);
        return { _id: user._id, userName, accessToken, refreshToken };
    }
}
export default authService
