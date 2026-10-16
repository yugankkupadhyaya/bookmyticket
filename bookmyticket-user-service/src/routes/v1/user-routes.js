const express = require('express');

const { UserController } = require('../../controllers');

const authenticate = require('../../middlewares/auth-middlewares');
const authorize = require('../../middlewares/role-middlewares');

const router = express.Router();


// Public
router.post(
    '/register',
    UserController.createUser
);


// Authenticated users
router.get(
    '/',
    authenticate,
    UserController.getAllUsers
);

router.get(
    '/:id',
    authenticate,
    UserController.getUser
);


// Admin only
router.patch(
    '/:id/activate',
    authenticate,
    authorize('ADMIN'),
    UserController.activateUser
);


router.patch(
    '/:id',
    authenticate,
    UserController.updateUser
);

router.delete(
    '/:id',
    authenticate,
    UserController.deleteUser
);

router.get(
    '/internal/:id',
    UserController.getUser
);

module.exports = router;