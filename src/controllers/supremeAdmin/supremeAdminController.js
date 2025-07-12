const SupremeAdmin = require("./../../models/supremeAdminSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("./../../config/logger"); 

// 🔹 Generate custom lead_id like LEAD_001
const generateSupremeAdminId = async () => {
  const lastSupremeAdmin = await SupremeAdmin.findOne().sort({ createdAt: -1 });
  const lastNum = lastSupremeAdmin?.employee_id?.split("_")[1] || "000";
  const next = String(Number(lastNum) + 1).padStart(3, "0");
  return `SUPER_${next}`;
};

// 🔹 Create Supreme Admin
const createSupremeAdmin = async (req, res) => {
  try {
    const {name , email, password } = req.body;

    // ✅ Validate Input
    if (!name || !email || !password) {
      logger.warn("⚠️ Missing email or password in request");
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Email and password are required",
      });
    }

    // ✅ Check if email already exists efficiently
    const existingAdmin = await SupremeAdmin.exists({ email });
    if (existingAdmin) {
      logger.warn(`⚠️ Email already in use: ${email}`);
      return res.status(409).json({
        success: false,
        status: 409,
        message: "Email is already registered",
      });
    }

    // ✅ Generate unique SupremeAdmin ID
    const supremeAdmin_id =await generateSupremeAdminId();

    // ✅ Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new admin (Optimized Query)
    const newAdmin = new SupremeAdmin({
      supremeAdmin_id,
      email,
      name,
      password: hashedPassword,
    });

    await newAdmin.save();

    logger.info(`✅ SupremeAdmin created: ${email} (ID: ${supremeAdmin_id})`);
    return res.status(201).json({
      success: true,
      status: 201,
      message: "SupremeAdmin created successfully",
      data: {
        supremeAdmin_id: newAdmin.supremeAdmin_id,
        email: newAdmin.email,
      },
    });
  } catch (error) {
    logger.error(`❌ Error creating SupremeAdmin: ${error.message}`, {
      stack: error.stack,
    });

    // ✅ Detailed error handling
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    return res.status(statusCode).json({
      success: false,
      status: statusCode,
      message: error.message || "Internal server error",
    });
  }
};

// 🔹 Login Supreme Admin
const loginSupremeAdmin = async (req, res) => {
  try {
    console.log(req.body); // ✅ fixed typo

    const { identifier, password } = req.body;

    // ✅ Check required fields
    if (!identifier || !password) {
      logger.warn("⚠️ Login failed: Missing identifier or password");
      return res.status(400).json({
        success: false,
        message: "Identifier and password are required",
      });
    }

    // ✅ Identify email or mobile login
    const isEmail = identifier.includes("@");
    const query = isEmail ? { email: identifier } : { mobileNumber: identifier };

    // ✅ Fetch Supreme Admin from DB
    const admin = await SupremeAdmin.findOne(query).select(
      "supremeAdmin_id email mobileNumber password role status name firstName lastName"
    );

    if (!admin) {
      logger.warn(`⚠️ Login failed for non-existing identifier: ${identifier}`);
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Invalid credentials",
      });
    }

    // ✅ Check password match
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      logger.warn(`⚠️ Incorrect password attempt for identifier: ${identifier}`);
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Invalid credentials",
      });
    }

    // ✅ JWT Generation
    if (!process.env.JWT_SECRET) {
      throw new Error("❌ Missing JWT_SECRET in environment variables");
    }

    const token = jwt.sign(
      {
        supremeAdmin_id: admin.supremeAdmin_id,
        role: admin.role,
        name: admin.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    logger.info(`✅ SupremeAdmin logged in successfully: ${admin.email}`);

    // ✅ Send response
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Login successful",
      data: {
        token,
        supremeAdmin_id: admin.supremeAdmin_id,
        email: admin.email,
        mobileNumber: admin.mobileNumber,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error) {
    logger.error(`❌ Error logging in SupremeAdmin: ${error.message}`, {
      stack: error.stack,
    });

    const statusCode = error.name === "ValidationError" ? 400 : 500;
    return res.status(statusCode).json({
      success: false,
      status: statusCode,
      message: error.message || "Internal server error",
    });
  }
};



// 🔹 Get Supreme Admin Details by supremeAdmin_id
const getSupremeAdminById = async (req, res) => {
  try {
    const { supremeAdmin_id } = req.params;

    // ✅ Validate Input
    if (!supremeAdmin_id) {
      logger.warn("⚠️ SupremeAdmin ID missing in request");
      return res.status(400).json({
        success: false,
        status: 400,
        message: "SupremeAdmin ID is required",
      });
    }

    // ✅ Optimize query by selecting only necessary fields
    const admin = await SupremeAdmin.findOne({ supremeAdmin_id }).select(
      "supremeAdmin_id email role status createdAt"
    );

    if (!admin) {
      logger.warn(`⚠️ SupremeAdmin not found: ${supremeAdmin_id}`);
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Admin not found",
      });
    }

    logger.info(`🔎 Retrieved SupremeAdmin: ${supremeAdmin_id}`);
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Admin retrieved successfully",
      data: admin,
    });
  } catch (error) {
    logger.error(`❌ Error retrieving SupremeAdmin: ${error.message}`, {
      stack: error.stack,
    });

    const statusCode = error.name === "ValidationError" ? 400 : 500;
    return res.status(statusCode).json({
      success: false,
      status: statusCode,
      message: error.message || "Internal server error",
    });
  }
};

// Update Supreme Admin Api
const updateSupremeAdmin = async (req, res) => {
  try {
    const { supremeAdmin_id } = req.params;
    const { email, password, status } = req.body;

    // ✅ Validate Input
    if (!supremeAdmin_id) {
      logger.warn("⚠️ SupremeAdmin ID missing in request");
      return res.status(400).json({
        success: false,
        status: 400,
        message: "SupremeAdmin ID is required",
      });
    }

    // ✅ Prepare update object dynamically
    const updateData = {};
    if (email) updateData.email = email;
    if (status) updateData.status = status;
    if (password) updateData.password = await bcrypt.hash(password, 10); // Secure password hashing

    // ✅ Update SupremeAdmin details (Optimized Query)
    const updatedAdmin = await SupremeAdmin.findOneAndUpdate(
      { supremeAdmin_id },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("supremeAdmin_id email role status updatedAt");

    if (!updatedAdmin) {
      logger.warn(`⚠️ SupremeAdmin not found for update: ${supremeAdmin_id}`);
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Admin not found",
      });
    }

    logger.info(`✅ SupremeAdmin updated successfully: ${supremeAdmin_id}`);
    return res.status(200).json({
      success: true,
      status: 200,
      message: "SupremeAdmin updated successfully",
      data: updatedAdmin,
    });
  } catch (error) {
    logger.error(`❌ Error updating SupremeAdmin: ${error.message}`, {
      stack: error.stack,
    });
    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message || "Internal server error",
    });
  }
};

// 🔹 Delete Supreme Admin by supremeAdmin_id
const deleteSupremeAdmin = async (req, res) => {
  try {
    const { supremeAdmin_id } = req.params;

    // ✅ Validate Input
    if (!supremeAdmin_id) {
      logger.warn("⚠️ SupremeAdmin ID missing in request");
      return res.status(400).json({
        success: false,
        status: 400,
        message: "SupremeAdmin ID is required",
      });
    }

    // ✅ Optimize query using `findOneAndDelete()`
    const admin = await SupremeAdmin.findOneAndDelete({ supremeAdmin_id });

    if (!admin) {
      logger.warn(`⚠️ SupremeAdmin not found for deletion: ${supremeAdmin_id}`);
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Admin not found",
      });
    }

    logger.info(`🗑️ SupremeAdmin deleted successfully: ${supremeAdmin_id}`);
    return res.status(200).json({
      success: true,
      status: 200,
      message: "SupremeAdmin deleted successfully",
      data: { supremeAdmin_id: admin.supremeAdmin_id, email: admin.email },
    });
  } catch (error) {
    logger.error(`❌ Error deleting SupremeAdmin: ${error.message}`, {
      stack: error.stack,
    });

    const statusCode = error.name === "ValidationError" ? 400 : 500;
    return res.status(statusCode).json({
      success: false,
      status: statusCode,
      message: error.message || "Internal server error",
    });
  }
};


const logoutSupremeAdmin = async (req, res) => {
  try {
    // 🧼 If using cookies, clear the token cookie
    res.clearCookie("token"); // Optional, if using cookies

    logger.info("🔓logged out");
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Logout successful",
    });
  } catch (error) {
    logger.error(`❌ Error during logout: ${error.message}`, {
      stack: error.stack,
    });
    return res.status(500).json({
      success: false,
      status: 500,
      message: "An error occurred during logout",
    });
  }
};

module.exports = {
  createSupremeAdmin,
  loginSupremeAdmin,
  getSupremeAdminById,
  updateSupremeAdmin,
  deleteSupremeAdmin,
  logoutSupremeAdmin
};
