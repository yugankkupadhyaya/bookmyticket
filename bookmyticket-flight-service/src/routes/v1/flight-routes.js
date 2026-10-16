const express = require('express');

const { FlightController } = require('../../controllers');
const { FlightMiddlewares , Authenticate, Authorize } = require('../../middlewares');
const { ROLES } = require('../../utils/common/enums');

const router = express.Router();

// /api/v1/flights POST
router.post('/', 
        FlightMiddlewares.validateCreateRequest,
        Authenticate,
        Authorize(ROLES.FLIGHT_COMPANY),
        FlightController.createFlight);

// /api/v1/flights?trips=MUM-DEL GET
router.get('/', 
        FlightController.getAllFlights);

// /api/v1/flights/:id GET
router.get('/:id', 
        FlightController.getFlight);
// /api/v1/flights/:id/seats PATCH
router.patch(
        '/:id/seats', 
        FlightMiddlewares.validateUpdateSeatsRequest,
        Authenticate,
        Authorize(ROLES.FLIGHT_COMPANY),
        FlightController.updateSeats
);

router.patch(
    '/:id/seats/internal',
    FlightMiddlewares.validateUpdateSeatsRequest,
    FlightController.updateSeats
);
module.exports = router;