
function BookingConfirmedTemplate(data) {
    return `
Hello,

Your flight booking has been confirmed successfully!

Booking ID: ${data.bookingId}
Flight ID: ${data.flightId}
Number of Seats: ${data.noofSeats}
Total Amount: ₹${data.totalCost}

Thank you for choosing BookMyTicket.

Have a safe and pleasant journey!

BookMyTicket Team
`;
}

module.exports = BookingConfirmedTemplate;
