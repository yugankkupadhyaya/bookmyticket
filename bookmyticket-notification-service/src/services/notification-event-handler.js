const NotificationService = require('./notification-service');

const {BookingCancelledTemplate , BookingConfirmedTemplate , PaymentRefundedTemplate,
       PaymentSuccessfulTemplate , UserRegisteredTemplate
} = require('../templates')

async function NotificationEventHandler(event) {

    const { eventType, data } = event;

    let user;
    let subject;
    let text;

    switch (eventType) {

        case 'user.registered':

            subject = 'Welcome to BookMyTicket';

            text = UserRegisteredTemplate(data);

            await NotificationService.sendNotificationEmail({
                to: data.email,
                subject,
                html: text
            });

            break;


        case 'booking.confirmed':

            user = await NotificationService.getUser(data.userId);

            subject = 'Booking Confirmed';

            text = BookingConfirmedTemplate({
                ...data,
                name: user.name
            });

            await NotificationService.sendNotificationEmail({
                to: user.email,
                subject,
                html: text
            });

            break;


        case 'booking.cancelled':

            user = await NotificationService.getUser(data.userId);

            subject = 'Booking Cancelled';

            text = BookingCancelledTemplate({
                ...data,
                name: user.name
            });

            await NotificationService.sendNotificationEmail({
                to: user.email,
                subject,
                html: text
            });

            break;


        case 'payment.successful':

            user = await NotificationService.getUser(data.userId);

            subject = 'Payment Successful';

            text = PaymentSuccessfulTemplate({
                ...data,
                name: user.name
            });

            await NotificationService.sendNotificationEmail({
                to: user.email,
                subject,
                html: text
            });

            break;


        case 'payment.refunded':

            user = await NotificationService.getUser(data.userId);

            subject = 'Payment Refunded';

            text = PaymentRefundedTemplate({
                ...data,
                name: user.name
            });

            await NotificationService.sendNotificationEmail({
                to: user.email,
                subject,
                html: text
            });

            break;


        default:
            console.log(`Unknown event: ${eventType}`);
    }
}


module.exports = {
    NotificationEventHandler
};