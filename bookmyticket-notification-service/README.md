# BookMyTicket Notification Service

Sends email notifications for events happening across the platform —
registration, booking confirmation/cancellation, payment success/refund —
without any other service having to know this one exists. It listens to the
shared RabbitMQ exchange and reacts on its own.

> Part of the [BookMyTicket monorepo](../)
> microservices platform. See the main repo for the full architecture,
> Docker Compose setup, and links to the other five services.

## Responsibilities

- **Consumes platform events** off the shared RabbitMQ topic exchange and sends the matching email
- **Resolves user details** (like an email address) by calling the User Service's internal lookup route — this service never touches the User Service's database directly
- **Templated emails** for each event type it handles
- **Fully decoupled** from the request path — nothing in the booking or payment flow waits on this service; a slow or failed email never blocks a booking or payment

## How It Fits into BookMyTicket

This is the only service that has no synchronous callers — nothing calls it
over REST expecting a response as part of a user-facing flow. It exists
purely as an event consumer:

```
Booking Service  ─┐
Payment Service  ─┼─→ RabbitMQ (app.events) → Notification Service → Email
User Service     ─┘
```

## Events Consumed

Bound to a durable `notification_queue`, subscribed to five routing keys on the `app.events` topic exchange:

| Event | Template |
|---|---|
| `user.registered` | `UserRegisteredTemplate` |
| `booking.confirmed` | `BookingConfirmedTemplate` |
| `booking.cancelled` | `BookingCancelledTemplate` |
| `payment.successful` | `PaymentSuccessfulTemplate` |
| `payment.refunded` | `PaymentRefundedTemplate` |

Each incoming message is parsed, handed to `NotificationEventHandler`, and
acknowledged only after it's been successfully processed. If handling
throws, the message is `nack`'d instead of acknowledged.

## Routes

Mounted at `/api`.

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/info` | Public | Basic service info / health-style endpoint |

## A Thing Worth Double-Checking

- **Failed messages are dropped, not retried.** The consumer calls `channel.nack(message, false, false)` on failure, which discards the message rather than requeuing it or routing it to a dead-letter queue. If sending an email fails for a transient reason (SMTP hiccup, brief network blip), that notification is silently lost rather than retried. A dead-letter queue would make failures recoverable instead of invisible.

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port the service listens on |
| `DATABASE_URL` | MySQL connection string for this service's database |
| `BOOKMYTICKET_USER_SERVICE` | Base URL of the User Service, used to resolve user details for emails |
| `GMAIL_EMAIL` / `GMAIL_PASS` | Credentials used to send email via Nodemailer |
| `RABBITMQ_HOST` / `RABBITMQ_PORT` / `RABBITMQ_USER` / `RABBITMQ_PASSWORD` | RabbitMQ connection details (note: this service takes these as four separate values, where the others use a single `RABBITMQ_URL` connection string) |

## Tech Stack

Node.js, Express, MySQL, Sequelize, RabbitMQ (amqplib), Nodemailer

## Running Locally

**As part of the full platform (recommended):** see the
[BookMyTicket hub directory](../BookMyTicket/) — the orchestration layer in this monorepo
`docker-compose up --build` brings this service up alongside the other five,
MySQL, and RabbitMQ, with migrations and seed data applied automatically.

**Standalone:**

```bash
npm install
# set PORT, DATABASE_URL, BOOKMYTICKET_USER_SERVICE, GMAIL_EMAIL, GMAIL_PASS,
# RABBITMQ_HOST, RABBITMQ_PORT, RABBITMQ_USER, RABBITMQ_PASSWORD
npm start
```

Running this service alone only makes sense for testing template rendering
directly — the actual notification flow needs RabbitMQ running and events
being published by the other services.

## Project Structure

```
├── controllers/
│   └── InfoController.js
├── services/
│   ├── notification-service.js    # sendNotificationEmail, createMail, getUser
│   ├── email-service.js           # Nodemailer wrapper
│   └── notification-event-handler.js
├── repositories/
│   └── NotificationRepository.js
├── consumers/
│   └── notification-consumer.js   # RabbitMQ connection, queue binding, message handling
├── templates/
│   ├── user-registered.js
│   ├── booking-confirmed.js
│   ├── booking-cancelled.js
│   ├── payment-successful.js
│   ├── payment-refunded.js
│   └── index.js
├── routes/
│   └── index.js
├── config/
│   └── ...                        # ServerConfig, Logger, ConnectRabbitMq
└── index.js                        # app entry
```
