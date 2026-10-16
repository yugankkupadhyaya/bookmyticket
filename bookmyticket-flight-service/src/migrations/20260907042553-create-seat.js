'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('Seats', {

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      airplaneId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Airplanes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      row: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      col: {
        type: Sequelize.STRING,
        allowNull: false
      },

      type: {
        type: Sequelize.ENUM(
          'BUSINESS',
          'ECONOMY',
          'PREMIUM_ECONOMY',
          'FIRST_CLASS'
        ),
        allowNull: false,
        defaultValue: 'ECONOMY'
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint('Seats', {
      fields: ['airplaneId', 'row', 'col'],
      type: 'unique',
      name: 'unique_airplane_seat'
    });
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable('Seats');

  }

};