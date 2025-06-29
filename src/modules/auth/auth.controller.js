import authService from "./auth.service.js";
import successHandler from "../../utils/successHandler.js";

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
}

export default authController;
