
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    BOOKMYTICKET_FLIGHT_SERVICE: process.env.BOOKMYTICKET_FLIGHT_SERVICE,
    RABBITMQ_URL:process.env.RABBITMQ_URL,
    JWT_SECRET:process.env.JWT_SECRET,
    JWT_EXPIRES_IN:process.env.JWT_EXPIRES_IN
}