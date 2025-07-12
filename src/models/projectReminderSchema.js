const mongoose = require("mongoose");

const assigneeSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  assignees: [assigneeSchema], // ⬅️ array of assignees
  deadline: { type: Date, required: true },
  reminderSentTo: { type: [String], default: [assigneeSchema] }, // ⬅️ track emails already reminded
});

module.exports = mongoose.model("Project Reminder", projectSchema);
