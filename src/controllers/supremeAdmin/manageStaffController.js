const Staff = require("../../models/addStaffModels");
const logger = require("../../config/logger");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const generateId = async () => {
  const lastStaff = await Staff.findOne().sort({ createdAt: -1 });
  const lastNum = lastStaff?.staff_id?.split("_")[1] || "000";
  const next = String(Number(lastNum) + 1).padStart(3, "0");
  return `STF_${next}`;
};

const createStaff = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      mobileNumber,
      whatsAppNumber,
      salaryPayout,
      salary,
      salaryCycle,
      openingBalance,
    } = req.body;

    const staff_id = await generateId(); // ✅ FIX: Add await here
    const hashPassword = await bcrypt.hash(password, 10);

    const newStaff = new Staff({
      staff_id,
      firstName,
      lastName,
      email,
      password: hashPassword,
      mobileNumber,
      whatsAppNumber,
      salaryPayout,
      salary,
      salaryCycle,
      openingBalance,
    });

    const savedStaff = await newStaff.save();

    logger?.info(`🧾 Staff created: ${firstName} ${lastName} (${staff_id})`);
    res.status(201).json({
      success: true,
      message: "Staff member added successfully",
      data: savedStaff,
    });
  } catch (err) {
    logger?.error(`❌ Failed to create staff: ${err.message}`, { stack: err.stack });
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



// 🔹 Get All Staff
const getAllStaff = async (req, res) => {
  try {
    const staffList = await Staff.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: staffList });
  } catch (err) {
    logger?.error(`❌ Fetch all staff error: ${err.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createStaff,
  getAllStaff,
};
