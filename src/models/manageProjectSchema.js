const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    project_id: {
      type: String,
      required: true,
      unique: true,
    },
    projectName: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    rate: {
      type: Number,
      required: [true, "Rate is required"],
    },
    priceType: {
      type: String,
      enum: ["Fixed", "Hourly", "Monthly", "Milestone"],
      required: [true, "Price type is required"],
    },
    required: {
      type: String,
      default: null,
      trim: true,
    },
    invoiceTime: {
      type: String,
      enum: ["Weekly", "Biweekly", "Monthly", "End of project"],
      required: [true, "Invoice time is required"],
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    productmanager: [String],
    assignteam: [String],
    salesperson: [String],
    message: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Ongoing", "Completed", "On Hold", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
