const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const {
    BOOKMYTICKET_USER_SERVICE,
    BOOKMYTICKET_FLIGHT_SERVICE,
    BOOKMYTICKET_BOOKING_SERVICE,
    BOOKMYTICKET_PAYMENT_SERVICE,
} = require("../config/server-config");

const router = express.Router();

router.use(
    "/users",
    createProxyMiddleware({
        target: BOOKMYTICKET_USER_SERVICE,
        changeOrigin: true,
        pathRewrite: {
            "^/": "/api/v1/users/",
        },
    })
);

router.use(
    "/auth",
    createProxyMiddleware({
        target: BOOKMYTICKET_USER_SERVICE,
        changeOrigin: true,
        pathRewrite: {
            "^/": "/api/v1/auth/",
        },
    })
);

router.use(
    "/flights",
    createProxyMiddleware({
        target: BOOKMYTICKET_FLIGHT_SERVICE,
        changeOrigin: true,
        pathRewrite: {
            "^/": "/api/v1/flights/",
        },
    })
);

router.use(
    "/bookings",
    createProxyMiddleware({
        target: BOOKMYTICKET_BOOKING_SERVICE,
        changeOrigin: true,
        pathRewrite: {
            "^/": "/api/v1/bookings/",
        },
    })
);

router.use(
    "/payments",
    createProxyMiddleware({
        target: BOOKMYTICKET_PAYMENT_SERVICE,
        changeOrigin: true,
        pathRewrite: {
            "^/": "/api/v1/payments/",
        },
    })
);

module.exports = router;