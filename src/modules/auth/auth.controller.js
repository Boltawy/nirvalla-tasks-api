import authService  from "./auth.service.js";

const authController = {
    signUp: async (req, res) => {
        try {
            const { firstName, lastName, email, password } = req.body;
            if (!firstName || !lastName || !email || !password) {
                return res.status(400).json({ message: "All fields are required" })
            }
            await authService.signUp(firstName, lastName, email, password)
            return res.status(201).json({ message: "User created successfully" })
        } catch (error) {
            console.error(error)
            if (error.message == "User already exists") {
                return res.status(409).json({ message: "User already exists" })
            }
            return res.status(500).json({ message: "Error creating user" })
        }
    },
    
    login: async (req, res) => {
        try {
            let { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "Request body error, Please provide email and password" })
            }
            const user = await authService.login(email, password)
            return res.status(200).json({ message: "Login successful", user })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: "Error logging in" })
        }
    },
}

export default authController;