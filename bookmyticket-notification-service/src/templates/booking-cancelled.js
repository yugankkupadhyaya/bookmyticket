
function BookingCancelledTemplate(data) {
    return `
Hello,

Your flight booking has been cancelled.

Booking ID: ${data.bookingId}
Flight ID: ${data.flightId}
Number of Seats: ${data.noofSeats}
Reason: ${data.reason}

If you did not request this cancellation or have any questions, please contact BookMyTicket support.

Thank you,
BookMyTicket Team
`;
}

module.exports = BookingCancelledTemplate;

