const express = require("express");
const rateLimit = require("express-rate-limit");

const { PORT } = require("./config/server-config");
const logger = require("./config/logger-config");
const routes = require("./routes");

const app = express();

app.use(express.json());

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 30,

    handler: (req, res) => {
        logger.warn(`Rate limit exceeded: ${req.ip}`);

        res.status(429).json({
            success: false,
            message: "Too many requests"
        });
    }
});

app.use(limiter);

app.use("/api/v1", routes);

app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "API Gateway is running"
    });
});

app.listen(PORT, () => {
    logger.info(`API Gateway running on PORT: ${PORT}`);
});