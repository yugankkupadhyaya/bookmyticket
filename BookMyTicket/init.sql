-- Flight Service
CREATE DATABASE IF NOT EXISTS bookmyticket;
CREATE USER IF NOT EXISTS 'bookmyticket_user'@'%' IDENTIFIED BY 'bookmyticket123!';
GRANT ALL PRIVILEGES ON bookmyticket.* TO 'bookmyticket_user'@'%';

-- User Service
CREATE DATABASE IF NOT EXISTS bookmyticket_users;
CREATE USER IF NOT EXISTS 'user'@'%' IDENTIFIED BY 'user';
GRANT ALL PRIVILEGES ON bookmyticket_users.* TO 'user'@'%';

-- Booking Service
CREATE DATABASE IF NOT EXISTS bookmyticket_booking;
CREATE USER IF NOT EXISTS 'bookmyticketbookinguser'@'%' IDENTIFIED BY 'bookmyticket';
GRANT ALL PRIVILEGES ON bookmyticket_booking.* TO 'bookmyticketbookinguser'@'%';

-- Payment Service
CREATE DATABASE IF NOT EXISTS bookmyticket_payment;
CREATE USER IF NOT EXISTS 'bookmyticketpaymentuser'@'%' IDENTIFIED BY 'payment';
GRANT ALL PRIVILEGES ON bookmyticket_payment.* TO 'bookmyticketpaymentuser'@'%';

-- Notification Service
CREATE DATABASE IF NOT EXISTS notification_db;
CREATE USER IF NOT EXISTS 'notification_user'@'%' IDENTIFIED BY 'noti';
GRANT ALL PRIVILEGES ON notification_db.* TO 'notification_user'@'%';

FLUSH PRIVILEGES;