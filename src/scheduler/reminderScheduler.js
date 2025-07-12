const Project = require("../models/projectReminderSchema"); // ✅ Project schema
const sendEmail = require("../services/emailService"); // ✅ sendEmail must be default-exported function
require("dotenv").config()
const reminderScheduler = async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Start of day

    const nextDay = new Date(tomorrow);
    nextDay.setDate(nextDay.getDate() + 1); // End of day

    const projects = await Project.find({
      deadline: { $gte: tomorrow, $lt: nextDay },
    });

    for (const project of projects) {
      for (const assignee of project.assignees) {
        const alreadySent = project.reminderSentTo.includes(assignee.email);
        console.log(alreadySent , "already sent")

        if (!alreadySent) {
          console.log(`📤 Sending reminder to ${assignee.email}`);

          await sendEmail({
            to: assignee.email,
            subject: `Reminder: ${project.projectName} is due tomorrow!`,
            text: `Hi ${assignee.name},\n\nJust a friendly reminder that the project "${project.projectName}" is due tomorrow (${project.deadline.toDateString()}).\n\nThanks.`,
          });

          project.reminderSentTo.push(assignee.email);
        }
      }

      await project.save();
    }

    console.log("✅ Reminders processed successfully.");
  } catch (error) {
    console.error("❌ Error in reminderScheduler:", error.message);
  }
};

module.exports = reminderScheduler;
