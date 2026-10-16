const { StatusCodes } = require('http-status-codes');

const { SuccessResponse, ErrorResponse } = require('../utils/common');

async function infoController(req, res) {
    try {
        SuccessResponse.message = 'Notification service is running';

        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(
                ErrorResponse.error(error.message)
            );
    }
}

module.exports = {
    infoController
};