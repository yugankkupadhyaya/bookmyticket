
const CrudRepository = require('./crud-repository');
const { User, Role } = require('../models');

class UserRepository extends CrudRepository {

    constructor() {
        super(User);
    }

    async findByEmail(email) {
        return await this.model.findOne({
            where: {
                email
            }
        });
    }

    async findByEmailWithRole(email) {
        return await this.model.findOne({
            where: {
                email
            },
            include: [
                {
                    model: Role,
                    as: 'role',
                    attributes: ['id', 'name']
                }
            ]
        });
    }

    async findByRole(roleId) {
        return await this.model.findAll({
            where: {
                roleId
            }
        });
    }
}

module.exports = UserRepository;

