const { ConnectRabbitMq } = require("../config");
const { NotificationEventHandler } = require("../services");
console.log("NotificationEventHandler:", NotificationEventHandler);
console.log("Type:", typeof NotificationEventHandler);
const startNotificationConsumer = async () => {

    const connection = await ConnectRabbitMq();

    const channel = await connection.createChannel();

    const exchange = "app.events";
    const queue = "notification_queue";

    await channel.assertExchange(exchange, "topic", {
        durable: true
    });

    await channel.assertQueue(queue, {
        durable: true
    });

    await channel.bindQueue(
        queue,
        exchange,
        "user.registered"
    );

    await channel.bindQueue(
        queue,
        exchange,
        "booking.confirmed"
    );

    await channel.bindQueue(
        queue,
        exchange,
        "booking.cancelled"
    );

    await channel.bindQueue(
        queue,
        exchange,
        "payment.successful"
    );

    await channel.bindQueue(
        queue,
        exchange,
        "payment.refunded"
    );

    console.log(`Listening for messages on ${queue}`);

    channel.consume(queue, async (message) => {

        if (!message) return;

        try {

            const event = JSON.parse(
                message.content.toString()
            );

            console.log(
                "Notification received:",
                event
            );

            await NotificationEventHandler(event);

            channel.ack(message);

        } catch (error) {

            console.error(
                "Notification processing failed:",
                error.message
            );

            // Don't acknowledge failed messages
            channel.nack(message, false, false);
        }
    });
};

module.exports = startNotificationConsumer;