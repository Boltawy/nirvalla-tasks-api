import authService from "./auth.service.js";
import successHandler from "../../utils/successHandler.js";
import { compareSync } from "bcrypt";

const authController = {
    signUp: async (req, res) => {
        const { userName, email, password } = req.body;
        await authService.signUp(userName, email, password);
        return successHandler(res, { message: "User created successfully" })
    },
    login: async (req, res) => {
        const { email: loginEmail, password: loginPassword } = req.body;
        const loginData = await authService.login(loginEmail, loginPassword);
        return successHandler(res, { message: "Login successful", ...loginData })
    },

    googleAuth: async (req, res) => {
        const { displayName, emails, photos } = req.user;
        const email = emails?.[0].value;
        const avatar = photos?.[0].value;
        if (!email || !avatar) { //TODO Handle if any data is missing, Create error oAuth page in frontend.
            return res.redirect(`http://localhost:3000`)
        }
        const { accessToken, refreshToken } = await authService.signUpOrLogin(displayName, email, avatar);
        res.redirect(`http://localhost:3000/google-redirect?accessToken=${accessToken}&refreshToken=${refreshToken}`)
    },
    githubAuth: async (req, res) => {
        const { displayName, emails, photos } = req.user;
        console.log(req.user)
        const email = emails?.[0].value;
        const avatar = photos?.[0].value;
        if (!email || !avatar) { //TODO Handle if any data is missing, Create error oAuth page in frontend.
            return res.redirect(`http://localhost:3000`)
        }
        const { accessToken } = await authService.signUpOrLogin(displayName, email, avatar);
        return res.redirect(`http://localhost:3000/github-redirect?accessToken=${accessToken}`)
    }
}

export default authController;
