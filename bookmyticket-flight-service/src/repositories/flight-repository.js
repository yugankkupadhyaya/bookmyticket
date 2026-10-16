const { Sequelize } = require('sequelize');

const CrudRepository = require('./crud-repository');
const {
    Flight,
    Airplane,
    Airport,
    City
} = require('../models');

const db = require('../models');
const { addRowLockOnFlights } = require('./queries');


class FlightRepository extends CrudRepository {

    constructor() {
        super(Flight);
    }
    async getAllFlights(
        filter,
        sort,
        limit,
        offset
    ) {

        const response = await Flight.findAll({
            where: filter,
            order: sort,
            limit,
            offset,
            include: [
                // Airplane
                
                {
                    model: Airplane,
                    required: true,
                    as: 'airplaneDetail'
                },
                // Departure Airport
                {
                    model: Airport,
                    required: true,
                    as: 'departureAirport',

                    on: {
                        col1: Sequelize.where(
                            Sequelize.col(
                                'Flight.departureAirportId'
                            ),
                            '=',
                            Sequelize.col(
                                'departureAirport.code'
                            )
                        )
                    },

                    include: {
                        model: City,
                        required: true
                    }
                },

                // Arrival Airport
                {
                    model: Airport,
                    required: true,
                    as: 'arrivalAirport',
                    on: {
                        col1: Sequelize.where(
                            Sequelize.col(
                                'Flight.arrivalAirportId'
                            ),
                            '=',
                            Sequelize.col(
                                'arrivalAirport.code'
                            )
                        )
                    },
                    include: {
                        model: City,
                        required: true
                    }
                }
            ]

        });

        return response;
    }

    async updateRemainingSeats(
        flightId,
        seats,
        dec = true
    ) {

        const transaction =
            await db.sequelize.transaction();

        try {

            // Lock the flight row
            await db.sequelize.query(
                addRowLockOnFlights(flightId),
                {
                    transaction
                }
            );


            const flight =
                await Flight.findByPk(
                    flightId,
                    {
                        transaction
                    }
                );


            if (!flight) {
                throw new Error(
                    'Flight not found'
                );
            }


            if (+dec) {

                await flight.decrement(
                    'availableSeats',
                    {
                        by: seats,
                        transaction
                    }
                );

            } else {

                await flight.increment(
                    'availableSeats',
                    {
                        by: seats,
                        transaction
                    }
                );

            }

            await transaction.commit();

            return await Flight.findByPk(flightId);

        } catch (error) {

            await transaction.rollback();

            throw error;
        }
    }
}


module.exports = FlightRepository;