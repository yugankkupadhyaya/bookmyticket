# BookMyTicket API Gateway

The single entry point into the BookMyTicket platform. Every client request hits
this service first — it proxies traffic to the right downstream microservice,
rate-limits by IP, and logs requests centrally, so individual services never
have to be exposed to the outside world directly.

> Part of the [BookMyTicket monorepo](../)
> microservices platform. See the main repo for the full architecture,
> Docker Compose setup, and links to the other five services.

## Responsibilities

- **Routing** — forwards incoming requests to the correct microservice based on path prefix
- **Rate limiting** — throttles requests per IP to protect downstream services from abuse or accidental overload
- **Centralized logging** — logs requests and rate-limit violations in one place instead of scattering that concern across every service
- **Health check** — a single endpoint to confirm the gateway itself is up

## How It Fits into BookMyTicket

```
Client → API Gateway → User Service
                     → Flight Service
                     → Booking Service
                     → Payment Service
```

The Notification Service isn't reachable through the gateway — it never
receives direct client requests. It listens to RabbitMQ events published by
the other services and sends emails asynchronously, so there's nothing for
the gateway to route to it.

## Routes

All routes are mounted under `/api/v1` and proxied to the matching service,
which re-receives the request under its own `/api/v1/...` namespace.

| Gateway Route | Proxied To | Downstream Path |
|---|---|---|
| `/api/v1/users/*` | User Service | `/api/v1/users/*` |
| `/api/v1/auth/*` | User Service | `/api/v1/auth/*` |
| `/api/v1/flights/*` | Flight Service | `/api/v1/flights/*` |
| `/api/v1/bookings/*` | Booking Service | `/api/v1/bookings/*` |
| `/api/v1/payments/*` | Payment Service | `/api/v1/payments/*` |

Proxying is handled by `http-proxy-middleware`, with `changeOrigin: true` so
the `Host` header matches the target service.

## Rate Limiting

Applied globally, before routes are matched:

- **Window:** 2 minutes
- **Limit:** 30 requests per IP
- Requests over the limit get a `429` response (`{ success: false, message: "Too many requests" }`) and are logged as a warning with the offending IP

## Health Check

```
GET /health
```

```json
{ "success": true, "message": "API Gateway is running" }
```

Useful for container health checks / uptime monitoring without hitting any downstream service.

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port the gateway listens on |
| `BOOKMYTICKET_USER_SERVICE` | Base URL of the User Service |
| `BOOKMYTICKET_FLIGHT_SERVICE` | Base URL of the Flight Service |
| `BOOKMYTICKET_BOOKING_SERVICE` | Base URL of the Booking Service |
| `BOOKMYTICKET_PAYMENT_SERVICE` | Base URL of the Payment Service |

## Tech Stack

Node.js, Express, `http-proxy-middleware`, `express-rate-limit`

## Running Locally

**As part of the full platform (recommended):** see the
[BookMyTicket hub directory](../BookMyTicket/) — the orchestration layer in this monorepo
`docker-compose up --build` brings this service up alongside the other five,
MySQL, and RabbitMQ, with all service URLs wired automatically.

**Standalone:**

```bash
npm install
# set PORT and the four BOOKMYTICKET_*_SERVICE env vars, pointing at wherever
# those services are running (locally or via Docker)
npm start
```

Note that running this service alone is only useful for testing the routing
and rate-limiting logic in isolation — the routes it proxies to won't
resolve to anything unless the downstream services are also running.

## Project Structure

```
├── config/
│   ├── server-config.js   # PORT + downstream service URLs
│   └── logger-config.js   # centralized logger
├── routes/
│   └── index.js           # proxy route definitions
└── index.js                # app entry: middleware, rate limiter, health check
```
