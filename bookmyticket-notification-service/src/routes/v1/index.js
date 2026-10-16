const express = require('express');

const { InfoController ,NotificationController} = require('../../controllers');



const router = express.Router();

router.get('/info',InfoController.infoController)

module.exports = router;