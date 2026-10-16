const express = require('express');

const { AirplaneController } = require('../../controllers');
const { AirplaneMiddlewares , Authenticate , Authorize} = require('../../middlewares');
const { ROLES } = require('../../utils/common/enums');

const router = express.Router();

// /api/v1/airplanes POST
router.post('/', 
        AirplaneMiddlewares.validateCreateRequest,
        Authenticate,
        Authorize(ROLES.ADMIN),
        AirplaneController.createAirplane);

// /api/v1/airplanes GET
router.get('/', 
        AirplaneController.getAirplanes);

// /api/v1/airplanes/:id GET
router.get('/:id', 
        AirplaneController.getAirplane);

// /api/v1/airplanes/:id DELETE
router.delete('/:id', 
        Authenticate,
        Authorize(ROLES.ADMIN),
        AirplaneController.destroyAirplane);

//  /api/v1/airplane/:id PATCH

router.patch('/:id',
        Authenticate,
        Authorize(ROLES.ADMIN),
        AirplaneController.updateAirplane);


module.exports = router;