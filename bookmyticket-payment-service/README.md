# BookMyTicket Payment Service

Handles payment processing for bookings through Razorpay — creating orders,
verifying payment authenticity server-side, confirming the associated
booking once that verification passes, and publishing payment events for
the rest of the platform to react to.

> Part of the [BookMyTicket monorepo](../)
> microservices platform. See the main repo for the full architecture,
> Docker Compose setup, and links to the other five services.

## Responsibilities

- **Create a Razorpay order** for a booking, after confirming the booking is still `initiated`, owned by the requester, and doesn't already have a payment record — this last check blocks a second order from ever being created for the same booking
- **Verify payment authenticity server-side** by recomputing the Razorpay signature — the service never takes a client's word that a payment succeeded
- **Confirm the booking** (via the Booking Service) only after signature verification passes
- **Publish payment events** so the Notification Service and others can react asynchronously
- **Issue refunds** through Razorpay for payments that succeeded

## Routes

Mounted at `/api/payments`.

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/payments` | Authenticated | Creates a Razorpay order for a booking |
| POST | `/payments/verify` | Authenticated | Verifies a completed payment's signature and confirms the booking |
| POST | `/payments/refund/:bookingId` | Authenticated | Issues a refund for a successful payment |

## Payment Flow, Step by Step

**1. Create (`createPayment`)**
- Fetches the booking from the Booking Service, forwarding the caller's JWT
- Rejects the request if the booking isn't `initiated`, isn't owned by the requesting user, or already has a payment record
- Creates a Razorpay order for the booking's total cost
- Stores a local `INITIATED` payment record linked to that order
- Returns the order details so the client can complete payment through Razorpay's checkout flow

**2. Verify (`verifyPayment`)**
- Looks up the local payment record by the Razorpay order ID
- Recomputes the HMAC-SHA256 signature server-side using the shared secret, and rejects the request if it doesn't match what Razorpay sent — this is what stops a forged "payment succeeded" call from a client
- Marks the payment `SUCCESS`
- Calls the Booking Service to confirm the booking
- Publishes `payment.successful`

**3. Refund (`refundPayment`)**
- Only allowed for payments currently `SUCCESS`
- Issues the refund through Razorpay, marks the payment `REFUNDED`, publishes `payment.refunded`

## Event Envelope

Every event published to the shared RabbitMQ topic exchange (`app.events`) follows the same shape:

```json
{
  "eventId": "uuid",
  "eventType": "payment.successful",
  "timestamp": "ISO-8601",
  "version": 1,
  "source": "payment-service",
  "data": { "...": "..." }
}
```

Messages are published as `persistent`, so they survive a RabbitMQ restart before being consumed.

**Events published:** `payment.successful`, `payment.refunded`

## A Thing Worth Double-Checking

- **`verifyPayment` doesn't check whether the payment is already `SUCCESS`** before reprocessing. If this endpoint is ever called twice for the same order — a client-side retry, for instance — it re-marks the payment successful and republishes `payment.successful`. The Booking Service's own guard against confirming an already-booked booking stops that specific side effect from repeating, but the event still goes out twice. Adding a first-processed-wins check at the top of `verifyPayment` would close this and make the idempotency guarantee complete end-to-end rather than partially enforced downstream.

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port the service listens on |
| `DATABASE_URL` | MySQL connection string for this service's database |
| `BOOKMYTICKET_BOOKING_SERVICE` | Base URL of the Booking Service |
| `BOOKMYTICKET_FLIGHT_SERVICE` | Base URL of the Flight Service |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Razorpay API credentials; the secret also verifies payment signatures |
| `RABBITMQ_URL` | Connection string for the shared RabbitMQ instance |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Used to verify JWTs issued by the User Service |

## Tech Stack

Node.js, Express, MySQL, Sequelize, Razorpay, RabbitMQ (amqplib)

## Running Locally

**As part of the full platform (recommended):** see the
[BookMyTicket hub directory](../BookMyTicket/) — the orchestration layer in this monorepo
`docker-compose up --build` brings this service up alongside the other five,
MySQL, and RabbitMQ, with migrations and seed data applied automatically.

**Standalone:**

```bash
npm install
# set PORT, DATABASE_URL, BOOKMYTICKET_BOOKING_SERVICE, RAZORPAY_KEY_ID,
# RAZORPAY_KEY_SECRET, RABBITMQ_URL, JWT_SECRET, JWT_EXPIRES_IN
npm start
```

Running this service alone only lets you test order creation and signature
verification in isolation — booking confirmation needs the Booking Service
reachable, and event publishing needs RabbitMQ running.

## Project Structure

```
├── controllers/
│   └── PaymentController.js
├── services/
│   └── PaymentService.js         # createPayment, verifyPayment, refundPayment
├── repositories/
│   └── payment-repository.js
├── middlewares/
│   └── authenticate-middlewares.js
├── routes/
│   ├── payment.js
│   └── index.js
├── events/
│   ├── index.js
│   ├── publisher.js               # publishEvent — builds and sends the event envelope
│   └── rabbitmq.js                # connectRabbitMQ, exchange setup
├── utils/
│   ├── common/                    # Enums (PAYMENT_STATUS)
│   └── helpers/razorpay.js        # Razorpay SDK wrapper
├── config/
│   └── ...                        # ServerConfig, Logger
└── index.js                        # app entry
```
