'use strict';

const bcrypt = require('bcrypt');

module.exports = {
    async up(queryInterface) {
        const password = await bcrypt.hash('admin123', 10);

        await queryInterface.bulkInsert('Users', [
            {
                name: 'Admin',
                email: 'admin@bookmyticket.com',
                password,
                roleId: 1, // ADMIN role ID
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('Users', {
            email: 'admin@bookmyticket.com'
        });
    }
};