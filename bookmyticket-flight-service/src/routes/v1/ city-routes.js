const express = require('express');

const { CityController } = require('../../controllers');
const { CityMiddlewares , Authenticate ,Authorize } = require('../../middlewares');

const { ROLES } = require('../../utils/common/enums');

const router = express.Router();

// POST /api/v1/cities
router.post(
    '/',
    CityMiddlewares.validateCreateRequest,
    Authenticate,
    Authorize(ROLES.ADMIN),
    CityController.createCity
);

// GET /api/v1/cities
router.get(
    '/',
    CityController.getAllCities
);

// GET /api/v1/cities/:id
router.get(
    '/:id',
    CityController.getCity
);

// PATCH /api/v1/cities/:id
router.patch(
    '/:id',
    Authenticate,
    Authorize(ROLES.ADMIN),
    CityController.updateCity
);

// DELETE /api/v1/cities/:id
router.delete(
    '/:id',
    Authenticate,
    Authorize(ROLES.ADMIN),
    CityController.destroyCity
);

module.exports = router;