# BookMyTicket Booking Service

Owns the booking lifecycle — creating a booking, confirming it once payment
succeeds, cancelling it, and automatically expiring reservations that never
get paid for. This is also the service that drives the seat-locking
guarantee: every seat reservation and release goes through the Flight
Service's internal seat endpoint inside a database transaction.

> Part of the [BookMyTicket monorepo](../)
> microservices platform. See the main repo for the full architecture,
> Docker Compose setup, and links to the other five services.

## Responsibilities

- **Create bookings** — checks seat availability and computes total cost against live flight data before writing anything
- **Confirm bookings** — moves a booking to `BOOKED` once payment is verified, and publishes an event so the rest of the platform can react
- **Cancel bookings** — user-initiated or automatic, always releasing the held seat back to the flight
- **Scheduled cleanup** — a background job cancels bookings left unconfirmed past a fixed time window, so abandoned reservations don't hold seats forever

## Routes

Mounted at `/api/bookings` (note: unlike the other services, this one isn't
versioned under `/api/v1`).

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/bookings` | Authenticated | Creates a booking for a flight |
| GET | `/bookings/:bookingId` | Authenticated, owner only | Fetches a single booking |
| PATCH | `/bookings/:bookingId/confirm` | Authenticated | Marks a booking `BOOKED` after payment is verified |
| PATCH | `/bookings/:bookingId/cancel` | Authenticated, owner only | Cancels a booking and releases its seats |

## Booking Flow, Step by Step

**1. Create (`createBooking`)**
- Opens a DB transaction
- Fetches the flight from the Flight Service, forwarding the caller's JWT
- Rejects the request if `noofSeats` exceeds the flight's available seats
- Computes `totalCost = noofSeats × flight.price`
- Inserts the booking row
- Calls the Flight Service's internal seat endpoint (`PATCH /flights/:id/seats/internal`) to decrement seat count
- Commits only after that call succeeds — any failure rolls the local booking back

**2. Confirm (`confirmBooking`)**
- Rejects confirming a cancelled or already-confirmed booking
- Updates status to `BOOKED` inside a transaction
- Publishes `booking.confirmed` — this is the step that runs once payment is verified, and what the Notification Service listens for to send a confirmation email

**3. Cancel (`cancelBooking`)**
- Verifies the requesting user owns the booking
- Releases the seat via the same internal Flight Service endpoint, passed a `dec: 0` flag so seats are added back instead of subtracted
- Updates status to `CANCELLED`, commits, then publishes `booking.cancelled`

**4. Scheduled expiry (`cancelOldBookings`, run by `schedulers/booking-scheduler`)**
- Finds bookings older than 5 minutes still unconfirmed
- Cancels each one and releases its seats through the same Flight Service call
- The safety net described in the platform-level README: even if the locking logic works perfectly at the moment of booking, this catches reservations abandoned mid-payment

## Seat Locking

The concurrency guarantee is split across two services: this service wraps
booking creation and cancellation in a DB transaction, and the seat count
itself lives on the flight record in the
[Flight Service](../bookmyticket-flight-service/),
mutated only through its internal `/seats/internal` route. That's where the
row-level lock is actually applied at the point seats are decremented, so
two overlapping booking requests for the same flight can't both succeed.

## Events Published

- `booking.confirmed` — after a booking is marked `BOOKED`
- `booking.cancelled` — after a booking is cancelled, manually or by the scheduler

The service connects to RabbitMQ once at startup, before the HTTP server
starts listening, so it can't come up in a state where it's accepting
requests but unable to publish events.

## A Couple of Things Worth Double-Checking

- **Seat check compares against `totalSeats`.** `createBooking` rejects a request only if `noofSeats` exceeds the flight's `totalSeats` field. Worth confirming that field reflects seats *currently available* rather than the flight's original capacity — otherwise a flight could accept more bookings than it actually has room for once earlier bookings have already reduced real availability.
- **Cross-service consistency.** The seat decrement/release call to the Flight Service happens over HTTP, outside the local DB transaction. If that call fails partway through — for example a timeout where the Flight Service actually processed it but the response never came back — the local booking rolls back, but the remote seat change might not. This is the known trade-off of the saga-style approach the platform uses instead of a distributed transaction (see the main BookMyTicket README's design decisions).

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port the service listens on |
| `DATABASE_URL` | MySQL connection string for this service's database |
| `BOOKMYTICKET_FLIGHT_SERVICE` | Base URL of the Flight Service |
| `RABBITMQ_URL` | Connection string for the shared RabbitMQ instance |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Used to verify JWTs issued by the User Service |

## Tech Stack

Node.js, Express, MySQL, Sequelize, Axios, RabbitMQ

## Running Locally

**As part of the full platform (recommended):** see the
[BookMyTicket hub directory](../BookMyTicket/) — the orchestration layer in this monorepo
`docker-compose up --build` brings this service up alongside the other five,
MySQL, and RabbitMQ, with migrations and seed data applied automatically.

**Standalone:**

```bash
npm install
# set PORT, DATABASE_URL, BOOKMYTICKET_FLIGHT_SERVICE, RABBITMQ_URL, JWT_SECRET, JWT_EXPIRES_IN
npm start
```

Running this service alone is only useful for testing booking logic in
isolation — seat lookups and updates need the Flight Service reachable, and
event publishing needs RabbitMQ running.

## Project Structure

```
├── controllers/
│   └── BookingController.js
├── services/
│   └── booking-service.js       # createBooking, confirmBooking, cancelBooking, cancelOldBookings
├── repositories/
│   └── BookingRepository.js
├── middlewares/
│   └── authenticate-middlewares.js
├── routes/
│   ├── booking.js
│   └── index.js
├── schedulers/
│   └── booking-scheduler.js      # runs cancelOldBookings on an interval
├── events/
│   └── ...                       # ConnectRabbitMq, PublishEvent
├── config/
│   └── ...                       # ServerConfig, Logger, Queue
└── index.js                       # app entry
```
