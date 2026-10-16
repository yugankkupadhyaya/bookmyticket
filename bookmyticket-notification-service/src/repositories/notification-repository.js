const CrudRepository = require('./crud-repository');
const { Notification } = require('../models');


class NotificationRepository extends CrudRepository {
    constructor() {
        super(Notification);
    }

    async getPendingNotification() {
        const response = await Notification.findAll({
            where: {
                status: 'PENDING'
            }
        });
        return response;
    }
}

module.exports = NotificationRepository;