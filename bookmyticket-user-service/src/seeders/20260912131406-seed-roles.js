'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Roles', [
            {
                name: 'ADMIN',
                description: 'System administrator',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'CUSTOMER',
                description: 'User who books flights',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'FLIGHT_COMPANY',
                description: 'Flight company representative',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Roles', {
            name: {
                [Sequelize.Op.in]: [
                    'ADMIN',
                    'CUSTOMER',
                    'FLIGHT_COMPANY'
                ]
            }
        });
    }
};