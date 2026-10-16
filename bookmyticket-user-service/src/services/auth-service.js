
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserRepository = require('../repositories/user-repository');

const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');

class AuthService {

    constructor() {
        this.userRepository = new UserRepository();
    }

    async login(data) {
        try {
            const { email, password } = data;

            const user =
                await this.userRepository.findByEmailWithRole(email);

            if (!user) {
                throw new AppError(
                    'Invalid email or password',
                    StatusCodes.UNAUTHORIZED
                );
            }

            if (!user.isActive) {
                throw new AppError(
                    'Your account is not active',
                    StatusCodes.FORBIDDEN
                );
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );

            if (!isPasswordValid) {
                throw new AppError(
                    'Invalid email or password',
                    StatusCodes.UNAUTHORIZED
                );
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    role: user.role.name
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
                }
            );

            return {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role.name
                }
            };

        } catch (error) {

            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError(
                'Unable to login user',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

     async logout(user) {
        return {
            userId: user.id
        };
    }
}


module.exports = AuthService;

