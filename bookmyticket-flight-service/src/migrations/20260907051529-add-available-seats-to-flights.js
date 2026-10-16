'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Flights', 'availableSeats', {
            type: Sequelize.INTEGER,
            allowNull: false
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn(
            'Flights',
            'availableSeats'
        );
    }
};