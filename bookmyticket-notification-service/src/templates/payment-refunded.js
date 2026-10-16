
function PaymentRefundedTemplate(data) {
    return `
Hello,

Your payment has been successfully refunded.

Payment ID: ${data.paymentId}
Booking ID: ${data.bookingId}
Refund Amount: ₹${data.amount}

The refund has been initiated to your original payment method.

Please allow some time for the amount to reflect in your account.

Thank you,
BookMyTicket Team
`;
}

module.exports = PaymentRefundedTemplate;

