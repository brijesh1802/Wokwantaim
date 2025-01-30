const jwt = require('jsonwebtoken');
const { isBlacklisted } = require('../utils/blacklist');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    // Check if Authorization header exists and starts with 'Bearer'
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).send({ error: 'Access denied. No token provided.' });
    }

    try {
        // Check if the token is blacklisted
        const blacklisted = await isBlacklisted(token);
        if (blacklisted) {
            return res.status(401).send({ error: 'Access denied. Token is blacklisted.' });
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;  // Attach user info to request object
        next();
    } catch (ex) {
        // Handle errors based on the type of the JWT error
        if (ex.name === 'JsonWebTokenError') {
            return res.status(400).send({ error: 'Invalid token.' });
        } else if (ex.name === 'TokenExpiredError') {
            return res.status(401).send({ error: 'Token has expired.' });
        } else {
            console.error('Token verification failed:', ex);
            return res.status(500).send({ error: 'Server error during token verification.' });
        }
    }
};

module.exports = authMiddleware;
