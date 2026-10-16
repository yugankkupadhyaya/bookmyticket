# BookMyTicket

BookMyTicket is a production-style airline booking platform implemented as a
single-repository microservices system.

## Services

| Service | Responsibility | Location |
| --- | --- | --- |
| API Gateway | Routing, rate limiting, request logging | [`bookmyticket-api-gateway/`](./bookmyticket-api-gateway/) |
| User Service | Authentication, JWT, and RBAC | [`bookmyticket-user-service/`](./bookmyticket-user-service/) |
| Flight Service | City, airport, flight, and seat management | [`bookmyticket-flight-service/`](./bookmyticket-flight-service/) |
| Booking Service | Booking flow and concurrency-safe seat locking | [`bookmyticket-booking-service/`](./bookmyticket-booking-service/) |
| Payment Service | Razorpay payment creation and verification | [`bookmyticket-payment-service/`](./bookmyticket-payment-service/) |
| Notification Service | RabbitMQ-driven email notifications | [`bookmyticket-notification-service/`](./bookmyticket-notification-service/) |

The Docker orchestration files and database initialization are in
[`BookMyTicket/`](./BookMyTicket/).

## Quick start

```bash
git clone https://github.com/yugankkupadhyaya/bookmyticket.git
cd bookmyticket/BookMyTicket
cp .env.example .env
docker compose up --build
```

Configure the credentials in `BookMyTicket/.env` before starting the stack.
Each service has its own README with service-specific setup and API details.
