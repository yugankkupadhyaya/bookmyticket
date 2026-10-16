# BookMyTicket User Service

Handles authentication, user accounts, and role-based access control for the
BookMyTicket platform. Every other service that needs to know who's making a
request, or whether they're allowed to, ultimately depends on this one.

> Part of the [BookMyTicket monorepo](../)
> microservices platform. See the main repo for the full architecture,
> Docker Compose setup, and links to the other five services.

## Responsibilities

- **Registration & login** — issues a JWT on successful login. Self-registration via `/register` only allows creating `customer` or `flight_company` accounts; `admin` is never self-assignable — it's seeded once at startup and can't be created through this route
- **RBAC** — three roles: `admin`, `customer`, `flight_company`, enforced per-route via middleware
- **Approval workflow** — new `flight_company` accounts register successfully but start inactive; an admin has to explicitly hit the activation endpoint before that account is allowed to create flights, so anyone registering as a flight company can't immediately start listing flights unverified
- **Internal lookups** — exposes an unauthenticated internal route so other services (e.g. Booking, Payment) can resolve basic user info without a public-facing auth flow

## Routes

Mounted at `/api/v1/auth` and `/api/v1/users` (reached through the API Gateway as `/auth/*` and `/users/*`).

### Auth

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/login` | Public | Authenticates a user and returns a JWT |
| POST | `/logout` | Authenticated | Logs the current user out |

### Users

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Creates a new `customer` or `flight_company` account — `admin` is seeded only, not self-registerable |
| GET | `/` | Authenticated | Lists all users |
| GET | `/:id` | Authenticated | Gets a single user by ID |
| PATCH | `/:id/activate` | Admin only | Approval step for `flight_company` accounts — until this runs, that account can't create flights |
| PATCH | `/:id` | Authenticated | Updates a user |
| DELETE | `/:id` | Authenticated | Deletes a user |
| GET | `/internal/:id` | Internal (no auth middleware) | Used by other services for server-to-server user lookups |

## Middleware

- **`authenticate`** — verifies the JWT on the request and attaches the user to `req`
- **`authorize(role)`** — gates a route to a specific role (e.g. `authorize('ADMIN')` on the activation endpoint)

## Events Published

Publishes to the shared RabbitMQ topic exchange so other services can react
without calling back into this one:

- `user.registered` — emitted after a successful registration

## A Known Consideration

`GET /internal/:id` is intentionally unauthenticated, for other services to
call directly. Right now the API Gateway proxies everything under
`/users/*`, including this route, so it's technically reachable from outside
too. A cleaner version of this would either keep internal routes off the
gateway's proxy path entirely, or put them on a separate internal-only
network/port that isn't exposed publicly.

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port the service listens on |
| `DATABASE_URL` | MySQL connection string for this service's database |
| `JWT_SECRET` | Secret used to sign and verify JWTs |
| `JWT_EXPIRES_IN` | JWT expiry duration |
| `RABBITMQ_URL` | Connection string for the shared RabbitMQ instance |

## Tech Stack

Node.js, Express, MySQL, Sequelize, JWT, RabbitMQ

## Running Locally

**As part of the full platform (recommended):** see the
[BookMyTicket hub directory](../BookMyTicket/) — the orchestration layer in this monorepo
`docker-compose up --build` brings this service up alongside the other five,
MySQL, and RabbitMQ, with migrations and seed data (including the seeded
`admin` account) applied automatically.

**Standalone:**

```bash
npm install
# set PORT, DATABASE_URL, JWT_SECRET, JWT_EXPIRES_IN, RABBITMQ_URL
npm start
```

## Project Structure

```
├── controllers/
│   └── ...                  # AuthController, UserController
├── middlewares/
│   ├── auth-middlewares.js  # JWT verification
│   └── role-middlewares.js  # role-based route guarding
├── routes/
│   ├── auth-routes.js
│   ├── user-routes.js
│   └── index.js
└── index.js                  # app entry
```
