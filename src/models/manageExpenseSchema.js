const mongoose = require("mongoose");

const manageExpenseSchema = new mongoose.Schema(
  {
    amount: {
      type: String,
      required: [true, "Amount is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    vendor: {
      type: String,
      required: [true, "Vendor is required"],
    },
    dueDate: {
      type: String,
      required: [true, "Due Date is required"],
    },
    bill: {
      type: String,
      required:false,
    },
    repeatType: {
      type: String,
      required: [true, "Repeat Type is required"],
    },
    note: {
      type: String,
      required: [true, "Note is required"],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Income Expense", manageExpenseSchema);
module.exports = Expense;
