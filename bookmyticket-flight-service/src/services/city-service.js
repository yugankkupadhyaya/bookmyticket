const {StatusCodes} = require('http-status-codes');

const  {CityRepository}  = require('../repositories');
const AppError = require('../utils/errors/app-error');

const cityRepository = new CityRepository();

// CREATE
async function createCity(data) {
    try {
        const city = await cityRepository.create(data);
        return city;

    } catch (error) {
        if (
            error.name === 'SequelizeValidationError' ||
            error.name === 'SequelizeUniqueConstraintError'
        ) {
            let explanation = [];

            error.errors.forEach((err) => {
                explanation.push(err.message);
            });

            throw new AppError(
                explanation,
                StatusCodes.BAD_REQUEST
            );
        }

        throw new AppError(
            'Cannot create a new city object',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}


// GET ONE
async function getCity(id) {
    try {
        const city = await cityRepository.get(id);
        return city;

    } catch (error) {
        if (error.statusCode === StatusCodes.NOT_FOUND) {
            throw new AppError(
                'The city you requested is not present',
                StatusCodes.NOT_FOUND
            );
        }

        throw new AppError(
            'Cannot fetch the city',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}


// GET ALL
async function getAllCities() {
    try {
        const cities = await cityRepository.getAll();
        return cities;

    } catch (error) {
        throw new AppError(
            'Cannot fetch cities',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}


// UPDATE
async function updateCity(id, data) {
    try {
        const city = await cityRepository.update(id, data);
        return city;

    } catch (error) {
        if (error.statusCode === StatusCodes.NOT_FOUND) {
            throw new AppError(
                'The city you requested to update is not present',
                StatusCodes.NOT_FOUND
            );
        }

        if (
            error.name === 'SequelizeValidationError' ||
            error.name === 'SequelizeUniqueConstraintError'
        ) {
            let explanation = [];

            error.errors.forEach((err) => {
                explanation.push(err.message);
            });

            throw new AppError(
                explanation,
                StatusCodes.BAD_REQUEST
            );
        }

        throw new AppError(
            'Cannot update the city',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}


// DELETE
async function destroyCity(id) {
    try {
        const response = await cityRepository.destroy(id);
        return response;

    } catch (error) {
        if (error.statusCode === StatusCodes.NOT_FOUND) {
            throw new AppError(
                'The city you requested to delete is not present',
                StatusCodes.NOT_FOUND
            );
        }

        throw new AppError(
            'Cannot delete the city',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}


module.exports = {
    createCity,
    getCity,
    getAllCities,
    updateCity,
    destroyCity
};

