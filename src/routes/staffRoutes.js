const express = require("express");
const router = express.Router();
const { Login } = require('../controllers/staff/authController')
const {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("../controllers/staff/manageLeadController");

// ➕ Create a new lead
router.post("/createLead", createLead);

// 📥 Get all leads
router.get("/getLead", getAllLeads);

// 🔍 Get a specific lead by Mongo _id
router.get("/getLead/:id", getLeadById);

// ♻️ Update a lead
router.put("/updateLead/:id", updateLead);

// ❌ Delete a lead
router.delete("/deleteLead/:lead_id", deleteLead);


module.exports = router;
