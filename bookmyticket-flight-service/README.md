# BookMyTicket Flight Service

Owns the core flight domain: cities, airports, airplanes, flights, and each
flight's live seat inventory. Every other service that needs flight or seat
data — Booking, Payment — goes through this one.

> Part of the [BookMyTicket](https://github.com/Chandan-kr-tiwari/BookMyTicket)
> microservices platform. See the main repo for the full architecture,
> Docker Compose setup, and links to the other five services.

## Responsibilities

- **CRUD ownership by role** — admin manages cities, airports, and airplanes; an approved `flight_company` manages only the flights it creates
- **Public read access** — anyone can browse cities, airports, airplanes, and flights without authenticating, mirroring how a real booking site lets you search before you log in
- **Flight search** — beyond a plain list, `GET /flights` supports filtering by route, price range, seat availability, and travel date, plus sorting and pagination, all in a single endpoint
- **Seat inventory** — each flight tracks seat availability; a flight company can update it directly, and an internal route lets other services (namely Booking, during the booking flow's seat-locking step) update seat counts programmatically

## Routes

All mounted under `/api/v1` (reached through the API Gateway as `/flights/*`,
`/cities/*`, `/airports/*`, `/airplanes/*`).

### Cities

| Method | Route | Access |
|---|---|---|
| POST | `/cities` | Admin only |
| GET | `/cities` | Public |
| GET | `/cities/:id` | Public |
| PATCH | `/cities/:id` | Admin only |
| DELETE | `/cities/:id` | Admin only |

### Airports

| Method | Route | Access |
|---|---|---|
| POST | `/airports` | Admin only |
| GET | `/airports` | Public |
| GET | `/airports/:id` | Public |
| DELETE | `/airports/:id` | Admin only |

### Airplanes

| Method | Route | Access |
|---|---|---|
| POST | `/airplanes` | Admin only |
| GET | `/airplanes` | Public |
| GET | `/airplanes/:id` | Public |
| PATCH | `/airplanes/:id` | Admin only |
| DELETE | `/airplanes/:id` | Admin only |

### Flights

| Method | Route | Access |
|---|---|---|
| POST | `/flights` | `flight_company` only |
| GET | `/flights` | Public — see [Flight Search & Filtering](#flight-search--filtering) below |
| GET | `/flights/:id` | Public |
| PATCH | `/flights/:id/seats` | `flight_company` only |
| PATCH | `/flights/:id/seats/internal` | Internal (no auth middleware) |

## Flight Search & Filtering

`GET /flights` isn't just a plain list — it accepts several query params
together, each independently validated, so a bad value fails fast with a
clear `400` instead of silently returning wrong results.

| Param | Example | Behavior |
|---|---|---|
| `trips` | `?trips=BOM-DEL` | Filters by departure/arrival airport pair. Must be exactly `ORIGIN-DEST`; both sides required and can't be the same airport |
| `price` | `?price=3000-7000` or `?price=3000` | Filters by price range. A single value is treated as the minimum, with the max defaulting to 20000 |
| `travellers` | `?travellers=3` | Only returns flights with at least that many available seats (must be a positive integer) |
| `tripDate` | `?tripDate=2026-09-15` | Filters by departure date, strict `YYYY-MM-DD` format, matched against the full day |
| `sort` | `?sort=price_ASC,departureTime_ASC` | Comma-separated `field_DIRECTION` pairs. Allowed fields: `price`, `departureTime`, `arrivalTime`, `availableSeats`. Defaults to `departureTime_ASC` if omitted |
| `page` / `limit` | `?page=2&limit=20` | Standard offset pagination. Defaults to `page=1`, `limit=10`; `limit` is capped at 100 regardless of what's requested, to prevent an unbounded query |

All filters can be combined in a single request — e.g.
`GET /flights?trips=BOM-DEL&price=3000-7000&travellers=2&sort=price_ASC&page=1&limit=20`
searches, filters, sorts, and paginates in one call. The response includes
a `pagination` block (`page`, `limit`, `offset`, `count`) alongside the
flight data.

## Middleware

- **`Authenticate`** — verifies the JWT issued by the User Service
- **`Authorize(role)`** — gates a route to a specific role via `ROLES` (`ADMIN`, `FLIGHT_COMPANY`)
- Per-resource validation middleware (`validateCreateRequest`, `validateUpdateSeatsRequest`, etc.) runs before auth checks, so malformed requests are rejected before they even hit the database

## Seat Locking & Reservation

Seat availability lives on the flight record in this service. The booking
flow (handled in the Booking Service) reserves a seat by calling
`PATCH /flights/:id/seats/internal` as part of a row-level-locked database
transaction — so two simultaneous booking requests for the same flight can't
both decrement the same seat. See the
[Booking Service README](https://github.com/Chandan-kr-tiwari/BookMyTicket-Booking-Service)
for the transaction details.

## A Known Consideration

Like the User Service's internal user-lookup route,
`PATCH /flights/:id/seats/internal` is intentionally unauthenticated so
other services can call it directly — but the API Gateway currently proxies
all of `/flights/*`, including this route, so it's technically reachable
from outside too. Restricting internal routes to a network path the gateway
doesn't expose would close that gap.

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port the service listens on |
| `DATABASE_URL` | MySQL connection string for this service's database |
| `JWT_SECRET` | Same secret used by the User Service, so tokens it issues can be verified here |
| `JWT_EXPIRES_IN` | JWT expiry duration |

## Tech Stack

Node.js, Express, MySQL, Sequelize, JWT

## Running Locally

**As part of the full platform (recommended):** see the
[BookMyTicket hub repo](https://github.com/Chandan-kr-tiwari/BookMyTicket) — a single
`docker-compose up --build` brings this service up alongside the other five,
MySQL, and RabbitMQ, with migrations and seed data applied automatically.

**Standalone:**

```bash
npm install
# set PORT, DATABASE_URL, JWT_SECRET, JWT_EXPIRES_IN
npm start
```

## Project Structure

```
├── controllers/
│   └── ...                     # InfoController, CityController, AirportController,
│                                # AirplaneController, FlightController
├── middlewares/
│   ├── Authenticate.js
│   ├── Authorize.js
│   ├── CityMiddlewares.js
│   ├── AirportMiddlewares.js
│   ├── AirplaneMiddlewares.js
│   └── FlightMiddlewares.js
├── routes/
│   ├── city-routes.js
│   ├── airport-routes.js
│   ├── airplane-router.js
│   ├── flight-routes.js
│   └── index.js
├── utils/
│   └── common/enums.js         # ROLES
└── index.js                     # app entry
```
