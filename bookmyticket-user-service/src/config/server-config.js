const dotenv = require('dotenv');

dotenv.config();

module.exports={
    PORT:process.env.PORT,
    JWT_SECRET:process.env.JWT_SECRET,
    JWT_EXPIRES_IN:process.env.JWT_EXPIRES_IN,
    RABBITMQ_URL:process.env.RABBITMQ_URL
}