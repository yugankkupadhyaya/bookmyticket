const express = require('express');


const UserRoutes = require('./user-routes');
const AuthRoutes = require('./auth-routes');
const router = express.Router();

router.use('/users', UserRoutes)
router.use('/auth', AuthRoutes);

module.exports = router;