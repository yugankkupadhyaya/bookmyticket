const express = require('express');

const { AirportController } = require('../../controllers');
const { AirportMiddlewares , Authenticate , Authorize } = require('../../middlewares');


const { ROLES } = require('../../utils/common/enums');


const router = express.Router();

// /api/v1/airports POST
router.post('/', 
        AirportMiddlewares.validateCreateRequest,
        Authenticate,
        Authorize(ROLES.ADMIN),
        AirportController.createAirport);

// /api/v1/airports GET
router.get('/', 
    AirportController.getAirports);

// /api/v1/airports/:id GET
router.get('/:id', 
    AirportController.getAirport);

// /api/v1/airports/:id DELETE
router.delete('/:id', 
    Authenticate,
    Authorize(ROLES.ADMIN),
    AirportController.destroyAirport);

module.exports = router;