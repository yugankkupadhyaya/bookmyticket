'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {

        await queryInterface.bulkInsert('Flights', [

            // =====================================================
            // DELHI → MUMBAI
            // =====================================================
              
               {
    flightNumber: 'AI101',
    airplaneId: 1,
    departureAirportId: 'DEL',
    arrivalAirportId: 'BOM',
    departureTime: new Date('2026-09-15T06:00:00'),
    arrivalTime: new Date('2026-09-15T08:15:00'),
    price: 4500,
    boardingGate: 'A1',
    totalSeats: 180,
    availableSeats: 180,
    createdAt: new Date(),
    updatedAt: new Date()
},

{
    flightNumber: '6E201',
    airplaneId: 2,
    departureAirportId: 'DEL',
    arrivalAirportId: 'BOM',
    departureTime: new Date('2026-09-15T10:30:00'),
    arrivalTime: new Date('2026-09-15T12:45:00'),
    price: 5200,
    boardingGate: 'A4',
    totalSeats: 180,
    availableSeats: 120,
    createdAt: new Date(),
    updatedAt: new Date()
},

{
    flightNumber: 'UK301',
    airplaneId: 3,
    departureAirportId: 'DEL',
    arrivalAirportId: 'BOM',
    departureTime: new Date('2026-09-15T18:00:00'),
    arrivalTime: new Date('2026-09-15T20:20:00'),
    price: 7800,
    boardingGate: 'B2',
    totalSeats: 250,
    availableSeats: 45,
    createdAt: new Date(),
    updatedAt: new Date()
},

            // =====================================================
            // MUMBAI → DELHI
            // =====================================================

            {
                flightNumber: 'AI102',
                airplaneId: 1,
                departureAirportId: 'BOM',
                arrivalAirportId: 'DEL',
                departureTime: new Date('2026-09-15T07:00:00'),
                arrivalTime: new Date('2026-09-15T09:15:00'),
                price: 4800,
                boardingGate: 'C1',
                totalSeats: 180,
                availableSeats: 160,
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                flightNumber: '6E202',
                airplaneId: 2,
                departureAirportId: 'BOM',
                arrivalAirportId: 'DEL',
                departureTime: new Date('2026-09-15T13:00:00'),
                arrivalTime: new Date('2026-09-15T15:20:00'),
                price: 6200,
                boardingGate: 'C4',
                totalSeats: 180,
                availableSeats: 75,
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                flightNumber: 'UK302',
                airplaneId: 3,
                departureAirportId: 'BOM',
                arrivalAirportId: 'DEL',
                departureTime: new Date('2026-09-15T21:00:00'),
                arrivalTime: new Date('2026-09-15T23:20:00'),
                price: 9500,
                boardingGate: 'D2',
                totalSeats: 250,
                availableSeats: 20,
                createdAt: new Date(),
                updatedAt: new Date()
            },


            // =====================================================
            // DELHI → BENGALURU
            // =====================================================

            {
                flightNumber: 'AI401',
                airplaneId: 1,
                departureAirportId: 'DEL',
                arrivalAirportId: 'BLR',
                departureTime: new Date('2026-09-16T06:30:00'),
                arrivalTime: new Date('2026-09-16T09:15:00'),
                price: 5500,
                boardingGate: 'E1',
                totalSeats: 180,
                availableSeats: 180,
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                flightNumber: '6E402',
                airplaneId: 2,
                departureAirportId: 'DEL',
                arrivalAirportId: 'BLR',
                departureTime: new Date('2026-09-16T11:00:00'),
                arrivalTime: new Date('2026-09-16T13:50:00'),
                price: 6800,
                boardingGate: 'E3',
                totalSeats: 180,
                availableSeats: 90,
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                flightNumber: 'UK403',
                airplaneId: 3,
                departureAirportId: 'DEL',
                arrivalAirportId: 'BLR',
                departureTime: new Date('2026-09-16T19:30:00'),
                arrivalTime: new Date('2026-09-16T22:20:00'),
                price: 8500,
                boardingGate: 'F2',
                totalSeats: 250,
                availableSeats: 30,
                createdAt: new Date(),
                updatedAt: new Date()
            },


            // =====================================================
            // BENGALURU → DELHI
            // =====================================================

            {
                flightNumber: 'AI404',
                airplaneId: 1,
                departureAirportId: 'BLR',
                arrivalAirportId: 'DEL',
                departureTime: new Date('2026-09-16T07:30:00'),
                arrivalTime: new Date('2026-09-16T10:15:00'),
                price: 5900,
                boardingGate: 'G1',
                totalSeats: 180,
                availableSeats: 140,
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                flightNumber: '6E405',
                airplaneId: 2,
                departureAirportId: 'BLR',
                arrivalAirportId: 'DEL',
                departureTime: new Date('2026-09-16T14:00:00'),
                arrivalTime: new Date('2026-09-16T16:50:00'),
                price: 7200,
                boardingGate: 'G4',
                totalSeats: 180,
                availableSeats: 65,
                createdAt: new Date(),
                updatedAt: new Date()
            },


            // =====================================================
            // MUMBAI → BENGALURU
            // =====================================================

            {
                flightNumber: 'AI501',
                airplaneId: 1,
                departureAirportId: 'BOM',
                arrivalAirportId: 'BLR',
                departureTime: new Date('2026-09-17T06:00:00'),
                arrivalTime: new Date('2026-09-17T07:50:00'),
                price: 3500,
                boardingGate: 'H1',
                totalSeats: 180,
                availableSeats: 175,
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                flightNumber: '6E502',
                airplaneId: 2,
                departureAirportId: 'BOM',
                arrivalAirportId: 'BLR',
                departureTime: new Date('2026-09-17T12:00:00'),
                arrivalTime: new Date('2026-09-17T13:50:00'),
                price: 4700,
                boardingGate: 'H3',
                totalSeats: 180,
                availableSeats: 100,
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                flightNumber: 'UK503',
                airplaneId: 2,
                departureAirportId: 'BOM',
                arrivalAirportId: 'BLR',
                departureTime: new Date('2026-09-17T20:30:00'),
                arrivalTime: new Date('2026-09-17T22:20:00'),
                price: 6900,
                boardingGate: 'H5',
                totalSeats: 250,
                availableSeats: 25,
                createdAt: new Date(),
                updatedAt: new Date()
            },


            // =====================================================
            // BENGALURU → MUMBAI
            // =====================================================

            {
                flightNumber: 'AI504',
                airplaneId: 1,
                departureAirportId: 'BLR',
                arrivalAirportId: 'BOM',
                departureTime: new Date('2026-09-17T08:00:00'),
                arrivalTime: new Date('2026-09-17T09:50:00'),
                price: 3900,
                boardingGate: 'J1',
                totalSeats: 180,
                availableSeats: 160,
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                flightNumber: '6E505',
                airplaneId: 2,
                departureAirportId: 'BLR',
                arrivalAirportId: 'BOM',
                departureTime: new Date('2026-09-17T16:00:00'),
                arrivalTime: new Date('2026-09-17T17:50:00'),
                price: 5100,
                boardingGate: 'J3',
                totalSeats: 180,
                availableSeats: 80,
                createdAt: new Date(),
                updatedAt: new Date()
            },


            // =====================================================
            // DELHI → HYDERABAD
            // =====================================================

            {
                flightNumber: 'AI601',
                airplaneId: 1,
                departureAirportId: 'DEL',
                arrivalAirportId: 'HYD',
                departureTime: new Date('2026-09-18T07:00:00'),
                arrivalTime: new Date('2026-09-18T09:20:00'),
                price: 4200,
                boardingGate: 'K1',
                totalSeats: 180,
                availableSeats: 150,
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                flightNumber: '6E602',
                airplaneId: 2,
                departureAirportId: 'DEL',
                arrivalAirportId: 'HYD',
                departureTime: new Date('2026-09-18T15:00:00'),
                arrivalTime: new Date('2026-09-18T17:20:00'),
                price: 5800,
                boardingGate: 'K3',
                totalSeats: 180,
                availableSeats: 60,
                createdAt: new Date(),
                updatedAt: new Date()
            },


            // =====================================================
            // HYDERABAD → DELHI
            // =====================================================

            {
                flightNumber: 'AI603',
                airplaneId: 3,
                departureAirportId: 'HYD',
                arrivalAirportId: 'DEL',
                departureTime: new Date('2026-09-18T10:30:00'),
                arrivalTime: new Date('2026-09-18T12:50:00'),
                price: 4600,
                boardingGate: 'L1',
                totalSeats: 250,
                availableSeats: 200,
                createdAt: new Date(),
                updatedAt: new Date()
            },


            // =====================================================
            // MUMBAI → CHENNAI
            // =====================================================

            {
                flightNumber: 'AI701',
                airplaneId: 1,
                departureAirportId: 'BOM',
                arrivalAirportId: 'MAA',
                departureTime: new Date('2026-09-19T06:30:00'),
                arrivalTime: new Date('2026-09-19T08:25:00'),
                price: 4100,
                boardingGate: 'M1',
                totalSeats: 180,
                availableSeats: 170,
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                flightNumber: '6E702',
                airplaneId: 3,
                departureAirportId: 'BOM',
                arrivalAirportId: 'MAA',
                departureTime: new Date('2026-09-19T18:00:00'),
                arrivalTime: new Date('2026-09-19T19:55:00'),
                price: 6300,
                boardingGate: 'M3',
                totalSeats: 180,
                availableSeats: 40,
                createdAt: new Date(),
                updatedAt: new Date()
            },


            // =====================================================
            // CHENNAI → MUMBAI
            // =====================================================

            {
                flightNumber: 'AI703',
                airplaneId: 3,
                departureAirportId: 'MAA',
                arrivalAirportId: 'BOM',
                departureTime: new Date('2026-09-19T09:30:00'),
                arrivalTime: new Date('2026-09-19T11:25:00'),
                price: 5000,
                boardingGate: 'N1',
                totalSeats: 250,
                availableSeats: 180,
                createdAt: new Date(),
                updatedAt: new Date()
            },


            // =====================================================
            // DELHI → KOLKATA
            // =====================================================

            {
                flightNumber: 'AI801',
                airplaneId: 1,
                departureAirportId: 'DEL',
                arrivalAirportId: 'CCU',
                departureTime: new Date('2026-09-20T08:00:00'),
                arrivalTime: new Date('2026-09-20T10:10:00'),
                price: 5200,
                boardingGate: 'P1',
                totalSeats: 180,
                availableSeats: 130,
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                flightNumber: '6E802',
                airplaneId: 2,
                departureAirportId: 'DEL',
                arrivalAirportId: 'CCU',
                departureTime: new Date('2026-09-20T17:00:00'),
                arrivalTime: new Date('2026-09-20T19:10:00'),
                price: 6900,
                boardingGate: 'P3',
                totalSeats: 180,
                availableSeats: 55,
                createdAt: new Date(),
                updatedAt: new Date()
            },


            // =====================================================
            // KOLKATA → DELHI
            // =====================================================

            {
                flightNumber: 'AI803',
                airplaneId: 1,
                departureAirportId: 'CCU',
                arrivalAirportId: 'DEL',
                departureTime: new Date('2026-09-20T11:30:00'),
                arrivalTime: new Date('2026-09-20T13:40:00'),
                price: 5600,
                boardingGate: 'Q1',
                totalSeats: 250,
                availableSeats: 210,
                createdAt: new Date(),
                updatedAt: new Date()
            },


            // =====================================================
            // DELHI → PUNE
            // =====================================================

            {
                flightNumber: 'AI901',
                airplaneId: 1,
                departureAirportId: 'DEL',
                arrivalAirportId: 'PNQ',
                departureTime: new Date('2026-09-21T07:30:00'),
                arrivalTime: new Date('2026-09-21T09:40:00'),
                price: 4900,
                boardingGate: 'R1',
                totalSeats: 180,
                availableSeats: 145,
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                flightNumber: '6E902',
                airplaneId: 1,
                departureAirportId: 'DEL',
                arrivalAirportId: 'PNQ',
                departureTime: new Date('2026-09-21T16:30:00'),
                arrivalTime: new Date('2026-09-21T18:40:00'),
                price: 6100,
                boardingGate: 'R3',
                totalSeats: 180,
                availableSeats: 70,
                createdAt: new Date(),
                updatedAt: new Date()
            },


            // =====================================================
            // DELHI → GOA
            // =====================================================

            {
                flightNumber: 'AI1001',
                airplaneId: 3,
                departureAirportId: 'DEL',
                arrivalAirportId: 'GOX',
                departureTime: new Date('2026-09-22T06:00:00'),
                arrivalTime: new Date('2026-09-22T08:45:00'),
                price: 7200,
                boardingGate: 'S1',
                totalSeats: 250,
                availableSeats: 190,
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                flightNumber: '6E1002',
                airplaneId: 1,
                departureAirportId: 'DEL',
                arrivalAirportId: 'GOI',
                departureTime: new Date('2026-09-22T14:00:00'),
                arrivalTime: new Date('2026-09-22T16:45:00'),
                price: 8500,
                boardingGate: 'S3',
                totalSeats: 180,
                availableSeats: 35,
                createdAt: new Date(),
                updatedAt: new Date()
            }

        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Flights', null, {});
    }
};