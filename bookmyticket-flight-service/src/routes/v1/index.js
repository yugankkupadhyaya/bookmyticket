const express = require('express');

const { InfoController, AirportController } = require('../../controllers');

const airplaneRoutes = require('./airplane-router')

const cityRoutes = require('./ city-routes')

const airportRoutes = require('./airport-routes');

const flightRoutes = require('./flight-routes');

const router = express.Router();

router.use('/airplanes' , airplaneRoutes)
router.use('/cities',cityRoutes)
router.use('/airports',airportRoutes)
router.use('/flights', flightRoutes)
router.get('/info', InfoController.info);


module.exports = router;