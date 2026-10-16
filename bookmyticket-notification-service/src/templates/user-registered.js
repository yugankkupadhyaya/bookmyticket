
function UserRegisteredTemplate(data) {
    return `
Hello ${data.name},

Welcome to BookMyTicket!

Your account has been successfully created.

You can now log in to your BookMyTicket account and start booking flights.

We are happy to have you with us.

Thank you,
BookMyTicket Team
`;
}

module.exports = UserRegisteredTemplate;

