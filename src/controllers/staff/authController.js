const Employee = require("../../models/addStaffModels");
const logger = require("../../config/logger");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
 
exports.Login = async (req, res) => {
  try {
    console.log(req.boy)
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
    const staff = await Employee.findOne(query);

    if (!staff) {
      logger.warn(`⚠️ Staff not found for identifier: ${identifier}`);
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      logger.warn(`⚠️ Invalid password for staff: ${identifier}`);
      return res.status(401).json({
        success: false,
        message: "Password does not match",
      });
    }
     // ✅ Generate JWT Token (Secure)
    if (!process.env.JWT_SECRET) {
      throw new Error("❌ Missing JWT_SECRET in environment variables");
    }

  const token = jwt.sign(
  { staff_id: staff._id, role: staff.role }, // 👈 use `staff`, not `admin`
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

logger.info(`✅ Staff logged in: ${staff.firstName} ${staff.lastName} (${staff._id})`);
res.status(200).json({
  success: true,
  message: "Logged in successfully",
  data: {
    token,
    staff_id: staff._id,
    email: staff.email,
    role: staff.role,
    status: staff.status,
  },
});

  } catch (error) {
    logger.error(`❌ Login error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
