const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

const authVerifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      logger.warn("⚠️ No token provided");
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Unauthorized: No token provided",
      });
    }
    

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // ✅ Allow these roles
    const allowedRoles = ["staff", "admin", "superadmin", "supremeadmin"];
    if (!allowedRoles.includes(decoded.role)) {
      const userId =
        decoded.supremeAdmin_id ||
        decoded.superAdmin_id ||
        decoded.admin_id ||
        decoded.staff_id ||
        "unknown";
      logger.warn(`⚠️ Insufficient role: ${decoded.role} attempted access`);
      return res.status(403).json({
        success: false,
        status: 403,
        message: "Forbidden: Insufficient permissions",
      });
    }

    const userId =
      decoded.id ||
      decoded.supremeAdmin_id ||
      decoded.superAdmin_id ||
      decoded.admin_id ||
      decoded.staff_id ||
      "unknown";

    logger.info(`✅ Verified access for: ${userId} (Role: ${decoded.role})`);
    next();
  } catch (error) {
    logger.error(`❌ Invalid token: ${error.message}`, { stack: error.stack });
    return res.status(403).json({
      success: false,
      status: 403,
      message: "Forbidden: Invalid token",
    });
  }
};

module.exports = authVerifyToken;
