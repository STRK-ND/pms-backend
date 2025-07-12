const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    staff_id: {
      type: String,
      required: [true, "Staff ID is required"],
      unique: true,
      trim: true,
    },

    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Second name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
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
    role: {
      type: String,
      enum: ["staff"], // restricts to 'staff' only (can add more like 'admin', 'superadmin', etc.)
      default: "staff",
      required: true,
    },

    salaryPayout: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    salaryCycle: {
      type: String,
      required: true,
    },
    openingBalance: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Staff = mongoose.model("Employee", staffSchema);
module.exports = Staff;
