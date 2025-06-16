import usersService from "./users.service.js";

const usersController = {
    getUsers: async (req, res) => {
        try {
            const data = await usersService.getAllUsers()
            return res.status(200).json({ "message": "Successful", data })
        } catch (error) {
            return res.status(500).json({ "message": "Error Fetching all users" })
        }
    },

    getUserById: async (req, res) => {
        const { id } = req.params;
        try {
            const data = await usersService.getUserById(id);
            if (data) return res.status(200).json({ "message": "Successful", data })
            return res.status(404).json({ "message": "No user with given ID" })
        } catch (error) {
            return res.status(500).json({ "message": "Error Fetching user" })
        }
    },

    updateUser: async (req, res) => {
        const { id } = req.params;
        try {
            const data = await usersService.updateUser(id, req.body);
            return res.status(200).json({ "message": "Successful", data })
        } catch (error) {
            return res.status(500).json({ "message": "Error Updating user" })
        }
    }
}

export default usersController