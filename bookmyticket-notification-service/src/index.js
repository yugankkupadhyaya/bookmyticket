

const express = require('express');

const { ServerConfig, Logger } = require('./config');
const apiRoutes = require('./routes');
const startNotificationConsumer = require('./consumers/notification-consumer');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    Logger.info('Health check requested');
    res.send('health');
});

const startApplication = async () => {
    try {
        await startNotificationConsumer();

        const server = app.listen(ServerConfig.PORT, () => {
            Logger.info(
                `Successfully started the server on PORT: ${ServerConfig.PORT}`
            );
        });

        server.on('error', (error) => {
            Logger.error(`Server error: ${error.message}`);
        });
    } catch (error) {
        Logger.error(`Failed to start application: ${error.message}`);
        process.exit(1);
    }
};

startApplication();