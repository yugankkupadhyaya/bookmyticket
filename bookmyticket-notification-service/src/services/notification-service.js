const { NotificationRepository } = require('../repositories');
const { ServerConfig } = require('../config');
const sendEmail = require('./email-service');

const notiRepo = new NotificationRepository();

async function sendNotificationEmail({ to, subject, html }) {
    try {
        const response = await sendEmail({
            to,
            subject,
            html
        });

        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function createMail(data) {
    try {
        const response = await notiRepo.create(data);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


async function getUser(userId) {
    try {
        const response = await fetch(
            `${ServerConfig.BOOKMYTICKET_USER_SERVICE}/api/v1/users/internal/${userId}`
        );

        if (!response.ok) {
            throw new Error('Unable to fetch user');
        }

        const result = await response.json();

        return result.data;
    } catch (error) {
        console.log('GET USER ERROR:', error.message);
        throw error;
    }
}

module.exports = {
    sendNotificationEmail,
    createMail,
    
    getUser
};