const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    staff_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee", // ✅ Must exactly match the registered model name
      required: true,
    },

    date: {
      type: String, // You can also use `type: Date` if needed
      required: true,
    },
    status: {
      type: String,
      enum: ["P", "A", "HD", "PL", "WL"], // Present, Absent, Half Day, Paid Leave, Week Leave
      required: true,
    },
    markedBy: {
      type: String, // ✅ Changed to String to accept custom ID like "SUPER_8671640"
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Fix index to match field names
attendanceSchema.index({ staff_id: 1, date: 1 }, { unique: true });

// ✅ Fix typo in model name
const Attendance = mongoose.model("Employee Attendance", attendanceSchema);
module.exports = Attendance;
