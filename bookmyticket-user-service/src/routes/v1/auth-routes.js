
const express = require('express');

const { AuthController } = require('../../controllers');

const Authenticate =require('../../middlewares/auth-middlewares')

const router = express.Router();

router.post('/login', AuthController.login);

router.post('/logout', Authenticate, AuthController.logout);


module.exports = router;

