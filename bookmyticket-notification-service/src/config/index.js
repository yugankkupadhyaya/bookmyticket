module.exports = {
    ServerConfig: require('./server-config'),
    Logger: require('./logger-config'),
    ConnectRabbitMq: require('./rabbitmq'),
    Mailer:require('./email-service')
};