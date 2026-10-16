'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Airports', [
            {
                name: 'Indira Gandhi International Airport',
                code: 'DEL',
                address: 'New Delhi, Delhi',
                cityId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Chhatrapati Shivaji Maharaj International Airport',
                code: 'BOM',
                address: 'Mumbai, Maharashtra',
                cityId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Kempegowda International Airport',
                code: 'BLR',
                address: 'Bengaluru, Karnataka',
                cityId: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Rajiv Gandhi International Airport',
                code: 'HYD',
                address: 'Hyderabad, Telangana',
                cityId: 4,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Chennai International Airport',
                code: 'MAA',
                address: 'Chennai, Tamil Nadu',
                cityId: 5,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Netaji Subhas Chandra Bose International Airport',
                code: 'CCU',
                address: 'Kolkata, West Bengal',
                cityId: 6,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Sardar Vallabhbhai Patel International Airport',
                code: 'AMD',
                address: 'Ahmedabad, Gujarat',
                cityId: 7,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Pune International Airport',
                code: 'PNQ',
                address: 'Pune, Maharashtra',
                cityId: 8,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Manohar International Airport',
                code: 'GOX',
                address: 'Mopa, Goa',
                cityId: 9,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Dabolim Airport',
                code: 'GOI',
                address: 'Dabolim, Goa',
                cityId: 9,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Jaipur International Airport',
                code: 'JAI',
                address: 'Jaipur, Rajasthan',
                cityId: 10,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Chaudhary Charan Singh International Airport',
                code: 'LKO',
                address: 'Lucknow, Uttar Pradesh',
                cityId: 11,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Cochin International Airport',
                code: 'COK',
                address: 'Kochi, Kerala',
                cityId: 12,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Lal Bahadur Shastri International Airport',
                code: 'VNS',
                address: 'Varanasi, Uttar Pradesh',
                cityId: 13,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Biju Patnaik International Airport',
                code: 'BBI',
                address: 'Bhubaneswar, Odisha',
                cityId: 14,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Lokpriya Gopinath Bordoloi International Airport',
                code: 'GAU',
                address: 'Guwahati, Assam',
                cityId: 15,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Airports', null, {});
    }
};