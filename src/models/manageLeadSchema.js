const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    lead_id: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    emailId: {
      type: String,
      required: [true, "Email ID is required"],
      lowercase: true,
      trim: true,
    },
       mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [
        /^[6-9]\d{9}$/,
        "Please enter a valid 10-digit mobile number starting with 6-9",
      ],
      maxlength: [10, "Mobile number cannot exceed 10 digits"],
      minlength: [10, "Mobile number must be 10 digits"],
    },

    whatsAppNumber: {
      type: String,
      required: [true, "WhatsApp number is required"],
      match: [
        /^[6-9]\d{9}$/,
        "Please enter a valid 10-digit WhatsApp number starting with 6-9",
      ],
      maxlength: [10, "WhatsApp number cannot exceed 10 digits"],
      minlength: [10, "WhatsApp number must be 10 digits"],
    },
    purpose: {
      type: String,
    },
    projectName: {
      type: String,
    },
    message: {
      type: String,
    },
    notes: {
      type: String,
    },
    assignedTo: {
      type: String,
    },
    status: {
      type: String,
      default: "New",
      enum: ["New", "In Progress", "Converted", "Closed"],
    },
    reminder: {
      type: String,
    },
    source: {
      type: String,
    },
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);
module.exports = Lead
