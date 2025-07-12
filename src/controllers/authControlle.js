const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

const supremeAdmin = require("../models/supremeAdminSchema");
// const Admin = require("../models/adminSchema");
const Staff = require("../models/addStaffModels");

const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      logger.warn("⚠️ Login failed: Missing identifier or password");
      return res.status(400).json({
        success: false,
        message: "Identifier and password are required",
      });
    }

    const isEmail = identifier.includes("@");
    const query = isEmail ? { email: identifier } : { mobileNumber: identifier };

    let user = null;
    let userType = null;

    // 🔹 Try SupremeAdmin
    user = await supremeAdmin.findOne(query).select(
      "supremeAdmin_id email mobileNumber password role status name"
    );
    if (user) userType = "SupremeAdmin";

    // 🔹 Try Admin
    // if (!user) {
    //   user = await Admin.findOne(query).select(
    //     "admin_id email mobileNumber password role status name"
    //   );
    //   if (user) userType = "Admin";
    // }

    // 🔹 Try Staff
    if (!user) {
      user = await Staff.findOne(query).select(
        "staff_id email mobileNumber password role status firstName lastName"
      );
      if (user) userType = "Staff";
    }

    if (!user) {
      logger.warn(`⚠️ Login failed: No user found for ${identifier}`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ✅ Password Check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`⚠️ Login failed: Invalid password for ${identifier}`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ✅ JWT Payload
    const payload = {
      role: user.role || userType,
    };

    if (userType === "SupremeAdmin") {
      payload.supremeAdmin_id = user.supremeAdmin_id;
      payload.name = user.name;
    // } else if (userType === "Admin") {
    //   payload.admin_id = user.admin_id;
    //   payload.name = user.name;
    } else if (userType === "Staff") {
      payload.staff_id = user.staff_id;
      payload.firstName = user.firstName;
      payload.lastName = user.lastName;
    }

    // 🔐 JWT Token
    if (!process.env.JWT_SECRET) {
      logger.error("❌ JWT_SECRET missing in environment");
      throw new Error("Missing JWT_SECRET");
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    logger.info(
      `✅ Login successful for ${identifier} [${userType}]`
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        role: payload.role,
        ...(payload.supremeAdmin_id && { supremeAdmin_id: payload.supremeAdmin_id }),
        // ...(payload.admin_id && { admin_id: payload.admin_id }),
        ...(payload.staff_id && { staff_id: payload.staff_id }),
        ...(payload.name && { name: payload.name }),
        ...(payload.firstName && { firstName: payload.firstName }),
        ...(payload.lastName && { lastName: payload.lastName }),
      },
    });
  } catch (error) {
    logger.error(`❌ loginUser error: ${error.message}`, { stack: error.stack });
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = loginUser;
