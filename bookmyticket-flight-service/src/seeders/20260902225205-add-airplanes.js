'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('Airplanes', [
      {
        modelNumber: 'A320',
        capacity: 180,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        modelNumber: 'B737',
        capacity: 189,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        modelNumber: 'B777',
        capacity: 396,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

 async down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Airplanes', {
    modelNumber: {
      [Sequelize.Op.in]: ['A320', 'B737', 'B777']
    }
  });
}
}
