// backend/middleware/authorozation.js

const jwt = require('jsonwebtoken');

const authorize = (req, res, next) => {
    let token;

    // --- PRIORITIZE: Check for token in Authorization header (Bearer token) ---
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1]; // Extract token after 'Bearer '
    }

    // --- FALLBACK: Check for token in admin_token cookie (less relevant for this method) ---
    if (!token && req.cookies && req.cookies.admin_token) {
        token = req.cookies.admin_token;
    }

    if (!token) {
        console.log("Authorization Error: No token found in header or cookie.");
        return res.status(401).json({ message: "Access token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; // Attach decoded payload to request
        next();
    } catch (error) {
        console.log("Authorization Error: Invalid token.", error);
        return res.status(403).json({ message: "Invalid token" });
    }
};

module.exports = authorize;