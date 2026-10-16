const CrudRepository = require('./crud-repository');
const { Role } = require('../models');

class RoleRepository extends CrudRepository {
    constructor() {
        super(Role);
    }

    async findByName(name) {
    return await this.model.findOne({
        where: {
            name
        }
    });
}

    
}

module.exports = RoleRepository;