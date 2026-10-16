const amqp = require("amqplib");

const connectRabbitMq = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.RABBITMQ_HOST,
      port: process.env.RABBITMQ_PORT,
      username: process.env.RABBITMQ_USER,
      password: process.env.RABBITMQ_PASSWORD,
    });

    console.log("RabbitMQ connected successfully");

    return connection;
  } catch (error) {
    console.error("RabbitMQ connection failed:", error.message);
    throw error;
  }
};

module.exports = connectRabbitMq;