const Attendence = require("../../models/ManageAttendanceSchema");
const Staff = require("../../models/addStaffModels");
const logger = require("../../config/logger");

// ✅ Create or Update Single Attendance
const markAttendance = async (req, res) => {
  const { supremeAdmin_id, records } = req.body;

  // ✅ Basic validation
  if (!supremeAdmin_id || !Array.isArray(records) || records.length === 0) {
    logger.warn("⚠️ markAttendance: Missing required fields", {
      body: req.body,
    });
    return res.status(400).json({
      success: false,
      message: "supremeAdmin_id and records are required",
    });
  }

  try {
    const savedRecords = [];

    for (let rec of records) {
      const { staff_id, date, status } = rec;

      if (!staff_id || !date || !status) continue;

      const existing = await Attendence.findOne({ staff_id, date });

      if (existing) {
        // Optional: Skip or update
        logger.info(
          `Attendance already marked for staff ${staff_id} on ${date}`
        );
        continue;
      }

      const newAttendance = new Attendence({
        staff_id,
        date,
        status,
        markedBy: supremeAdmin_id,
      });

      const saved = await newAttendance.save();
      savedRecords.push(saved);
    }

    res.status(200).json({
      success: true,
      message: `${savedRecords.length} attendance record(s) saved.`,
    });
  } catch (err) {
    logger.error("❌ markAttendance failed:", err);
    res.status(500).json({
      success: false,
      message: "Server error while marking attendance",
    });
  }
};

const bulkSaveAttendance = async (req, res) => {
  const { supremeAdmin_id, records } = req.body;

  // ✅ Basic validation
  if (!supremeAdmin_id || !Array.isArray(records) || records.length === 0) {
    logger.warn("⚠️ bulkSaveAttendance: Missing required fields", req.body);
    return res.status(400).json({
      success: false,
      message: "supremeAdmin_id and records[] are required",
    });
  }

  try {
    const result = [];

    for (const rec of records) {
      const { staff_id, date, status } = rec;

      if (!staff_id || !date || !status) {
        logger.warn("⚠️ Skipping invalid record:", rec);
        continue;
      }

      const existing = await Attendence.findOne({ staff_id, date });

      if (existing) {
        const updated = await Attendence.findByIdAndUpdate(
          existing._id,
          { status },
          { new: true }
        );
        result.push(updated);
      } else {
        const created = await Attendence.create({
          staff_id,
          date,
          status,
          markedBy: supremeAdmin_id, // ✅ Use correct field
        });
        result.push(created);
      }
    }

    logger.info(`✅ Bulk saved ${result.length} attendance records`);
    res.status(201).json({
      success: true,
      message: "Attendance saved successfully",
      data: result,
    });
  } catch (error) {
    logger.error(`❌ bulkSaveAttendance error: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = bulkSaveAttendance;

// ✅ Get All Attendance Records
const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendence.find();
    // .populate("supremeAdmin_id", "firstName lastName staff_id")
    // .populate("markedBy", "name email");

    logger.info(`📋 Retrieved ${attendance.length} attendance records`);
    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    logger.error(`❌ getAllAttendance error: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Filter Attendance Records
const filterAttendance = async (req, res) => {
  const { date, status } = req.body;
  const supremeAdmin_id = req.params.supremeAdmin_id;

  if (!supremeAdmin_id) {
    return res.status(400).json({
      success: false,
      message: "SupremeAdmin ID is required in URL parameter",
    });
  }

  const query = {
    markedBy: supremeAdmin_id,
  };
  if (date) query.date = date;
  if (status) query.status = status;

  try {
    const attendance = await Attendence.find(query).populate(
      "staff_id",
      "firstName lastName staff_id"
    );

    logger.info(
      `🔍 Filtered attendance: ${
        attendance.length
      } records for criteria ${JSON.stringify(query)}`
    );

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    logger.error(`❌ filterAttendance error: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// ✅ Delete Attendance
const deleteAttendance = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Attendence.findByIdAndDelete(id);
    if (!deleted) {
      logger.warn(`⚠️ Attendance not found: ${id}`);
      return res
        .status(404)
        .json({ success: false, message: "Attendance not found" });
    }

    logger.info(`🗑️ Deleted attendance record: ${id}`);
    res.status(200).json({
      success: true,
      message: "Attendance deleted successfully",
    });
  } catch (error) {
    logger.error(`❌ deleteAttendance error: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  markAttendance,
  bulkSaveAttendance,
  getAllAttendance,
  filterAttendance,
  deleteAttendance,
};
