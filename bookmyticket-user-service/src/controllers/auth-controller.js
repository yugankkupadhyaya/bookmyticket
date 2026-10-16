
const AuthService = require('../services/auth-service');

const authService = new AuthService();

class AuthController {

    async login(req, res) {
        try {
            const response = await authService.login(req.body);

            return res.status(200).json({
                success: true,
                message: 'Login successful',
                data: response
            });

        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message
            });
        }
    }

   async logout(req, res) {
    try {
        const response = await authService.logout(req.user);

        return res.status(200).json({
            success: true,
            message: 'Logout successful',
            data: response
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
}
}

module.exports = new AuthController();

