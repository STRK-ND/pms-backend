const Expense = require("../../models/manageExpenseSchema");
const logger = require("../../config/logger");

// 🔹 CREATE
const createExpense = async (req, res) => {
  try {
    const {
      amount,
      category,
      vendor,
      dueDate,
      bill,
      repeatType,
      note,
      status,
    } = req.body;
    console.log(req.body , "Income Expense")

    // Basic validation
    if (!amount || !category || !vendor || !dueDate  || !repeatType || !note || !status) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Optional duplication check
    const existing = await Expense.findOne({ vendor, dueDate });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Duplicate expense: same vendor, and due date.",
      });
    }

    const newExpense = new Expense({
      amount,
      category,
      vendor,
      dueDate,
      bill,
      repeatType,
      note,
      status,
    });

    const saved = await newExpense.save();

    logger?.info(`💸 Expense created: ${category} – ₹${amount}`);
    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: saved,
    });
  } catch (err) {
    logger?.error(`❌ Create error: ${err.message}`, { stack: err.stack });
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 READ ALL
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: expenses });
  } catch (err) {
    logger?.error(`❌ Read all error: ${err.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 READ BY ID
const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }
    res.status(200).json({ success: true, data: expense });
  } catch (err) {
    logger?.error(`❌ Read by ID error: ${err.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 UPDATE
const updateExpense = async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    logger?.info(`🔄 Expense updated: ${req.params.id}`);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    logger?.error(`❌ Update error: ${err.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 DELETE
const deleteExpense = async (req, res) => {
  try {
    const removed = await Expense.findByIdAndDelete(req.params.id);
    if (!removed) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    logger?.info(`🗑️ Expense deleted: ${req.params.id}`);
    res.status(200).json({ success: true, message: "Expense deleted successfully" });
  } catch (err) {
    logger?.error(`❌ Delete error: ${err.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
