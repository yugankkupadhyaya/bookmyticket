const UserRepository = require('../repositories/user-repository');
const RoleRepository = require('../repositories/role-repository');
const {PublishEvent} =require('../events')

const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');

class UserService {

    constructor() {
        this.userRepository = new UserRepository();
        this.roleRepository = new RoleRepository();
    }

    
async createUser(data) {
    try {
        const { name, email, password, role } = data;

        const existingUser =
            await this.userRepository.findByEmail(email);

        if (existingUser) {
            throw new AppError(
                'User already exists with this email',
                StatusCodes.CONFLICT
            );
        }

        // Only CUSTOMER and FLIGHT_COMPANY can register
        if (!['CUSTOMER', 'FLIGHT_COMPANY'].includes(role)) {
            throw new AppError(
                'Invalid registration role',
                StatusCodes.BAD_REQUEST
            );
        }

        // Find role from database
        const userRole =
            await this.roleRepository.findByName(role);

        if (!userRole) {
            throw new AppError(
                'Role not found',
                StatusCodes.NOT_FOUND
            );
        }

        // Flight companies require admin approval
        const isActive = role === 'CUSTOMER';

        // Create user
        const user = await this.userRepository.create({
            name,
            email,
            password,
            roleId: userRole.id,
            isActive
        });

            await PublishEvent('user.registered', {
            userId: user.id,
            name: user.name,
            email: user.email
    });

        // Remove password from response
        const userResponse = user.toJSON();

        delete userResponse.password;

        return userResponse;

         

    } catch (error) {

        console.log('ERROR NAME:', error.name);
        console.log('ERROR MESSAGE:', error.message);

        if (
            error.name === 'SequelizeValidationError' ||
            error.name === 'SequelizeUniqueConstraintError'
        ) {
            const explanation = error.errors.map(
                (err) => err.message
            );

            throw new AppError(
                explanation,
                StatusCodes.BAD_REQUEST
            );
        }

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError(
            'Cannot create a new user object',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}


   async getUser(id) {
    try {
        const user = await this.userRepository.get(id);

        const userResponse = user.toJSON();
        delete userResponse.password;

        return userResponse;

    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError(
            'Cannot fetch user',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}
    async getAllUsers() {
        try {
            return await this.userRepository.getAll();
        } catch (error) {
            throw new AppError(
                'Cannot fetch users',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    async updateUser(id, data) {
        try {
            await this.userRepository.get(id);

            if (data.email) {
                const existingUser =
                    await this.userRepository.findByEmail(data.email);

                if (
                    existingUser &&
                    existingUser.id !== Number(id)
                ) {
                    throw new AppError(
                        'Email already in use',
                        StatusCodes.CONFLICT
                    );
                }
            }

            if (data.roleId) {
                await this.roleRepository.get(data.roleId);
            }

            await this.userRepository.update(id, data);

            return await this.userRepository.get(id);

        } catch (error) {
            console.log(error.name);

            if (
                error.name === 'SequelizeValidationError' ||
                error.name === 'SequelizeUniqueConstraintError'
            ) {
                const explanation = [];

                error.errors.forEach((err) => {
                    explanation.push(err.message);
                });

                throw new AppError(
                    explanation,
                    StatusCodes.BAD_REQUEST
                );
            }

            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError(
                'Cannot update user',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    async deleteUser(id) {
        try {
            const user = await this.userRepository.get(id);

            await this.userRepository.destroy(id);

            return user;

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError(
                'Cannot delete user',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findUserByEmail(email) {
        try {
            return await this.userRepository.findByEmail(email);
        } catch (error) {
            throw new AppError(
                'Cannot find user by email',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findUsersByRole(roleId) {
        try {
            await this.roleRepository.get(roleId);

            return await this.userRepository.findByRole(roleId);

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError(
                'Cannot find users by role',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

     async activateUser(id) {
    try {
        const user = await this.userRepository.get(id);

        const role = await this.roleRepository.get(user.roleId);

        if (role.name !== 'FLIGHT_COMPANY') {
            throw new AppError(
                'Only flight company accounts require approval',
                StatusCodes.BAD_REQUEST
            );
        }

        if (user.isActive) {
            throw new AppError(
                'User is already active',
                StatusCodes.BAD_REQUEST
            );
        }

        await this.userRepository.update(id, {
            isActive: true
        });

        const updatedUser = await this.userRepository.get(id);

        const response = updatedUser.toJSON();
        delete response.password;

        return response;

    } catch (error) {

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError(
            'Cannot activate user',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}
}

module.exports = UserService;