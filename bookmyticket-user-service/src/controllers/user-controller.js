const {UserService} = require('../services');

const userService = new UserService()

class UserController {

    async createUser(req, res) {
        try {
            const user = await userService.createUser(req.body);

            return res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: user
            });

        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getUser(req, res) {
        try {
            const user = await userService.getUser(req.params.id);

            return res.status(200).json({
                success: true,
                message: 'User fetched successfully',
                data: user
            });

        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();

            return res.status(200).json({
                success: true,
                message: 'Users fetched successfully',
                data: users
            });

        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateUser(req, res) {
        try {
            const user = await userService.updateUser(
                req.params.id,
                req.body
            );

            return res.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: user
            });

        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteUser(req, res) {
        try {
            const user = await userService.deleteUser(req.params.id);

            return res.status(200).json({
                success: true,
                message: 'User deleted successfully',
                data: user
            });

        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message
            });
        }
    }

    async activateUser(req, res) {
    try {
        const user = await userService.activateUser(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: 'Flight company approved successfully',
            data: user
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
}
}

module.exports = new UserController();