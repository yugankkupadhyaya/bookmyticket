const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');

const { FlightRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');

const flightRepository = new FlightRepository();


// CREATE FLIGHT


async function createFlight(data) {
    try {

        // 1. Required fields
        const requiredFields = [
            'flightNumber',
            'airplaneId',
            'departureAirportId',
            'arrivalAirportId',
            'departureTime',
            'arrivalTime',
            'price',
            'totalSeats',
            'availableSeats'
        ];

        for (const field of requiredFields) {
            if (
                data[field] === undefined ||
                data[field] === null ||
                data[field] === ''
            ) {
                throw new AppError(
                    `${field} is required`,
                    StatusCodes.BAD_REQUEST
                );
            }
        }


        // 2. Departure and arrival cannot be same
        if (
            data.departureAirportId === data.arrivalAirportId
        ) {
            throw new AppError(
                'Departure and arrival airports cannot be the same',
                StatusCodes.BAD_REQUEST
            );
        }


        // 3. Validate dates
        const departureTime = new Date(data.departureTime);
        const arrivalTime = new Date(data.arrivalTime);

        if (
            Number.isNaN(departureTime.getTime()) ||
            Number.isNaN(arrivalTime.getTime())
        ) {
            throw new AppError(
                'Invalid departure or arrival time',
                StatusCodes.BAD_REQUEST
            );
        }

        if (arrivalTime <= departureTime) {
            throw new AppError(
                'Arrival time must be after departure time',
                StatusCodes.BAD_REQUEST
            );
        }


        // 4. Validate price
        if (
            !Number.isFinite(Number(data.price)) ||
            Number(data.price) <= 0
        ) {
            throw new AppError(
                'Price must be greater than zero',
                StatusCodes.BAD_REQUEST
            );
        }


        // 5. Validate seats
        if (
            !Number.isInteger(Number(data.totalSeats)) ||
            Number(data.totalSeats) <= 0
        ) {
            throw new AppError(
                'Total seats must be a positive integer',
                StatusCodes.BAD_REQUEST
            );
        }


        // 6. Available seats cannot exceed total seats
        if (
            !Number.isInteger(Number(data.availableSeats)) ||
            Number(data.availableSeats) < 0 ||
            Number(data.availableSeats) > Number(data.totalSeats)
        ) {
            throw new AppError(
                'Available seats must be between 0 and total seats',
                StatusCodes.BAD_REQUEST
            );
        }


        // 7. Normalize values
        data.flightNumber = data.flightNumber
            .trim()
            .toUpperCase();

        data.departureAirportId = data.departureAirportId
            .trim()
            .toUpperCase();

        data.arrivalAirportId = data.arrivalAirportId
            .trim()
            .toUpperCase();


        const flight = await flightRepository.create(data);

        return flight;

    } catch (error) {

        if (error.statusCode) {
            throw error;
        }

        if (error.name === 'SequelizeValidationError') {

            const explanation = error.errors.map(
                (err) => err.message
            );

            throw new AppError(
                explanation,
                StatusCodes.BAD_REQUEST
            );
        }


        if (error.name === 'SequelizeForeignKeyConstraintError') {

            throw new AppError(
                'Invalid airplane or airport reference',
                StatusCodes.BAD_REQUEST
            );
        }


        if (error.name === 'SequelizeUniqueConstraintError') {

            throw new AppError(
                'A flight with this information already exists',
                StatusCodes.CONFLICT
            );
        }


        console.error('Flight creation error:', error);

        throw new AppError(
            'Cannot create a new Flight object',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

// GET ALL FLIGHTS


async function getAllFlights(query = {}) {

    try {

        const customFilter = {};

        let sortFilter = [
            ['departureTime', 'ASC']
        ];


        // ------------------------------------------
        // ROUTE FILTER
        // ?trips=BOM-DEL
        // ------------------------------------------

        if (query.trips) {

            const route = query.trips
                .trim()
                .toUpperCase();

            const airports = route.split('-');

            if (airports.length !== 2) {
                throw new AppError(
                    'Trips must be in format BOM-DEL',
                    StatusCodes.BAD_REQUEST
                );
            }

            const [
                departureAirportId,
                arrivalAirportId
            ] = airports;

            if (
                !departureAirportId ||
                !arrivalAirportId
            ) {
                throw new AppError(
                    'Both departure and arrival airports are required',
                    StatusCodes.BAD_REQUEST
                );
            }

            if (
                departureAirportId === arrivalAirportId
            ) {
                throw new AppError(
                    'Departure and arrival airports cannot be the same',
                    StatusCodes.BAD_REQUEST
                );
            }

            customFilter.departureAirportId =
                departureAirportId;

            customFilter.arrivalAirportId =
                arrivalAirportId;
        }


        // ------------------------------------------
        // PRICE FILTER
        //
        // ?price=3000-7000
        // ?price=3000
        // ------------------------------------------

        if (query.price) {

            const prices = query.price
                .split('-')
                .map(Number);

            if (
                prices.length > 2 ||
                prices.some(
                    (price) => !Number.isFinite(price)
                )
            ) {
                throw new AppError(
                    'Price must be in format 3000-7000',
                    StatusCodes.BAD_REQUEST
                );
            }

            const minPrice = prices[0];
            const maxPrice =
                prices.length === 2
                    ? prices[1]
                    : 20000;

            if (minPrice < 0 || maxPrice < 0) {
                throw new AppError(
                    'Price cannot be negative',
                    StatusCodes.BAD_REQUEST
                );
            }

            if (minPrice > maxPrice) {
                throw new AppError(
                    'Minimum price cannot be greater than maximum price',
                    StatusCodes.BAD_REQUEST
                );
            }

            customFilter.price = {
                [Op.between]: [
                    minPrice,
                    maxPrice
                ]
            };
        }


        // ------------------------------------------
        // TRAVELLERS / AVAILABLE SEATS
        //
        // ?travellers=3
        // ------------------------------------------

        if (query.travellers !== undefined) {

            const travellers = Number(query.travellers);

            if (
                !Number.isInteger(travellers) ||
                travellers <= 0
            ) {
                throw new AppError(
                    'Travellers must be a positive integer',
                    StatusCodes.BAD_REQUEST
                );
            }

            customFilter.availableSeats = {
                [Op.gte]: travellers
            };
        }


        // ------------------------------------------
        // TRIP DATE
        //
        // ?tripDate=2026-09-15
        // ------------------------------------------

        if (query.tripDate) {

            const tripDate = query.tripDate.trim();

            // Strict YYYY-MM-DD
            if (
                !/^\d{4}-\d{2}-\d{2}$/.test(tripDate)
            ) {
                throw new AppError(
                    'tripDate must be in YYYY-MM-DD format',
                    StatusCodes.BAD_REQUEST
                );
            }

            const startOfDay =
                new Date(`${tripDate}T00:00:00`);

            const endOfDay =
                new Date(`${tripDate}T23:59:59.999`);

            if (
                Number.isNaN(startOfDay.getTime()) ||
                Number.isNaN(endOfDay.getTime())
            ) {
                throw new AppError(
                    'Invalid trip date',
                    StatusCodes.BAD_REQUEST
                );
            }

            customFilter.departureTime = {
                [Op.between]: [
                    startOfDay,
                    endOfDay
                ]
            };
        }


        // ------------------------------------------
        // SORTING
        //
        // ?sort=price_ASC
        // ?sort=price_DESC
        //
        // ?sort=price_ASC,departureTime_ASC
        // ------------------------------------------

        if (query.sort) {

            const allowedSortFields = [
                'price',
                'departureTime',
                'arrivalTime',
                'availableSeats'
            ];

            const sortParams = query.sort
                .split(',');

            sortFilter = [];

            for (const param of sortParams) {

                const parts = param.split('_');

                if (parts.length !== 2) {
                    throw new AppError(
                        'Invalid sort format',
                        StatusCodes.BAD_REQUEST
                    );
                }

                const [field, direction] = parts;

                if (
                    !allowedSortFields.includes(field)
                ) {
                    throw new AppError(
                        `Cannot sort by ${field}`,
                        StatusCodes.BAD_REQUEST
                    );
                }

                const normalizedDirection =
                    direction.toUpperCase();

                if (
                    !['ASC', 'DESC'].includes(
                        normalizedDirection
                    )
                ) {
                    throw new AppError(
                        'Sort direction must be ASC or DESC',
                        StatusCodes.BAD_REQUEST
                    );
                }

                sortFilter.push([
                    field,
                    normalizedDirection
                ]);
            }
        }


        // ------------------------------------------
        // PAGINATION
        //
        // ?page=1&limit=10
        // ------------------------------------------

        let page = Number(query.page) || 1;
        let limit = Number(query.limit) || 10;

        if (
            !Number.isInteger(page) ||
            page < 1
        ) {
            throw new AppError(
                'Page must be a positive integer',
                StatusCodes.BAD_REQUEST
            );
        }

        if (
            !Number.isInteger(limit) ||
            limit < 1
        ) {
            throw new AppError(
                'Limit must be a positive integer',
                StatusCodes.BAD_REQUEST
            );
        }

        // Prevent huge queries
        if (limit > 100) {
            limit = 100;
        }

        const offset = (page - 1) * limit;


        // ------------------------------------------
        // REPOSITORY
        // ------------------------------------------

        const flights =
            await flightRepository.getAllFlights(
                customFilter,
                sortFilter,
                limit,
                offset
            );

        return {
            data: flights,
            pagination: {
                page,
                limit,
                offset,
                count: flights.length
            }
        };

    } catch (error) {

        if (error.statusCode) {
            throw error;
        }

        console.error('Flight search error:', error);

        throw new AppError(
            'Cannot fetch data of all the flights',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}


// --------------------------------------------------
// GET SINGLE FLIGHT
// --------------------------------------------------

async function getFlight(id) {

    try {

        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            throw new AppError(
                'Invalid flight ID',
                StatusCodes.BAD_REQUEST
            );
        }

        const flight =
            await flightRepository.get(Number(id));

        return flight;

    } catch (error) {

        if (error.statusCode) {
            throw error;
        }

        console.error('Get flight error:', error);

        throw new AppError(
            'Cannot fetch data of the flight',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}


// --------------------------------------------------
// UPDATE SEAT AVAILABILITY
// --------------------------------------------------

async function updateSeats(data) {

    try {

        if (!data) {
            throw new AppError(
                'Seat update data is required',
                StatusCodes.BAD_REQUEST
            );
        }

        const flightId = Number(data.flightId);
        const seats = Number(data.seats);

        if (
            !Number.isInteger(flightId) ||
            flightId <= 0
        ) {
            throw new AppError(
                'Invalid flight ID',
                StatusCodes.BAD_REQUEST
            );
        }

        if (
            !Number.isInteger(seats) ||
            seats <= 0
        ) {
            throw new AppError(
                'Seats must be a positive integer',
                StatusCodes.BAD_REQUEST
            );
        }


        // Convert dec safely
        const decrement =
            data.dec === undefined
                ? true
                : Boolean(Number(data.dec));


        const response =
            await flightRepository.updateRemainingSeats(
                flightId,
                seats,
                decrement
            );

        return response;

    } catch (error) {

        if (error.statusCode) {
            throw error;
        }

        console.error('Update seats error:', error);

        throw new AppError(
            'Cannot update seat availability',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}


module.exports = {
    createFlight,
    getAllFlights,
    getFlight,
    updateSeats
};