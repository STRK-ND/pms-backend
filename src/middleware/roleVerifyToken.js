const jwt = require('jsonwebtoken');
const logger = require('../config/logger');


const roleVerifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Extract token

        // ✅ Validate Token Presence
        if (!token) {
            logger.warn('⚠️ No token provided');
            return res.status(401).json({ success: false, status: 401, message: 'Unauthorized: No token provided' });
        }

        // ✅ Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // Check contents
        req.user = decoded; // Store token payload in request

        // ✅ Verify Role (`supremeadmin`, `superadmin`, OR `admin` Required)
        if (!['supremeadmin', 'superadmin', 'admin'].includes(decoded.role)) {
            logger.warn(`⚠️ Insufficient role: ${decoded.role} attempted access`);
            return res.status(403).json({ success: false, status: 403, message: 'Forbidden: Insufficient permissions' });
        }

        logger.info(`✅ User authenticated: ${decoded.id} (Role: ${decoded.role})`);
        next(); // Proceed to the next middleware/controller

    } catch (error) {
        logger.error(`❌ Invalid token: ${error.message}`, { stack: error.stack });
        return res.status(403).json({ success: false, status: 403, message: 'Forbidden: Invalid token' });
    }
};

module.exports = roleVerifyToken;
