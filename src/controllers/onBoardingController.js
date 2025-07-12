const Employee = require("../models/onBoardingFormSchema");
const logger = require("../config/logger");

// 🔹 Generate custom lead_id like LEAD_001
const generateEmployeeId = async () => {
  const lastEmployee = await Employee.findOne().sort({ createdAt: -1 });
  const lastNum = lastEmployee?.employee_id?.split("_")[1] || "000";
  const next = String(Number(lastNum) + 1).padStart(3, "0");
  return `EMP_${next}`;
};


// ➕ CREATE Employee
const createEmployee = async (req, res) => {
  try {
    console.log(req.body, "req.body");
    const required = [
      "employeeName",
      "designation",
      "email",
      "mobileNo",
      "doj",
      "dob",
    ];
    const missing = required.filter((field) => !req.body[field]);

    if (missing.length) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(", ")}`,
      });
    }
    const employee_id = await generateEmployeeId();

    const newEmployee = new Employee({
      ...req.body,
      employee_id, // ✅ use correct schema field name
    });
    const saved = await newEmployee.save();

    logger?.info(`✅ Employee created: ${saved.employee_id}`);
    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: saved,
    });
  } catch (err) {
    logger?.error(`❌ Create employee error: ${err.message}`, {
      stack: err.stack,
    });
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 📥 READ All Employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    logger?.info(`📋 Fetched ${employees.length} employees`);
    res.status(200).json({ success: true, data: employees });
  } catch (err) {
    logger?.error(`❌ Get all employees error: ${err.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔍 READ by ID
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    logger?.info(`🔎 Employee fetched: ${employee.employee_id}`);
    res.status(200).json({ success: true, data: employee });
  } catch (err) {
    logger?.error(`❌ Get employee by ID error: ${err.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ♻️ UPDATE
const updateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    logger?.info(`🛠️ Employee updated: ${updated.employee_id}`);
    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: updated,
    });
  } catch (err) {
    logger?.error(`❌ Update employee error: ${err.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ❌ DELETE
const deleteEmployee = async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    logger?.info(`🗑️ Employee deleted: ${deleted.employee_id}`);
    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (err) {
    logger?.error(`❌ Delete employee error: ${err.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
