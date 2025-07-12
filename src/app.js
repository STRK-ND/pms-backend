const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const logger = require("./config/logger"); // Import logger
const supperAdminRoute = require("./routes/supremeAdminRoutes");
const MasterSetting = require("./routes/masterSettingRoutes")
const StaffRoutes = require("./routes/staffRoutes")
const OnBoardingForm = require("./routes/userRoutes")
const Login = require("./routes/authRoutes")
require("dotenv").config();
// const Login = require("./routes/authRoutes")

const app = express();

// ✅ Middleware
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://frontend-91sxyag14-rajat-kashyaps-projects.vercel.app', 'https://lol-ijabdk6qs-rajat-kashyaps-projects.vercel.app']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// ✅ Connect Database
connectDB();

// Parses incoming JSON requests

app.use(express.urlencoded({ extended: true }));

// ✅ Log Application Startup
logger.info("🚀 Express app initialized");

// ✅ Placeholder for Routes (Add actual routes later)
app.use((req, res, next) => {
  logger.info(`📥 ${req.method} ${req.url}`);
  next();
});

// Route
app.use("/api/supreme-admin", supperAdminRoute);
app.use("/api/master-setting", MasterSetting);
app.use("/api/staff", StaffRoutes);
app.use("/api/users", OnBoardingForm);
app.use("/api/auth", Login);






// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error(`❌ Error: ${err.message}`);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Export the app for use in server.js
module.exports = app;
