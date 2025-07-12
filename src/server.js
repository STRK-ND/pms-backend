const app = require('./app');
const logger = require('./config/logger'); // Import logger
const scheduleReminderCheck = require("./scheduler/reminderScheduler")

const PORT = process.env.PORT || 5000;

// 🏁 Start Server
app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    scheduleReminderCheck()
});
