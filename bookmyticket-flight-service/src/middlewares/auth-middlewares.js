const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        console.log("Flight Service Authorization:", authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        console.log("JWT ERROR:", error.message);

        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

module.exports=authenticate