import authService from "./task.service.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import successHandler from "../../utils/successHandler.js";

const authController = {
    signUp: asyncHandler(async (req, res) => {
        await authService.signUp(req.body);
        return successHandler(res, { message: "User created successfully" })
    }),
    login: asyncHandler(async (req, res) => {
        const loginData = await authService.login(req.body);
        return successHandler(res, { message: "Login successful", ...loginData })
    }),
}

export default authController;
