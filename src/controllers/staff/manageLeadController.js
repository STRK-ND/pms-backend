const Lead = require("../../models/manageLeadSchema");
const logger = require("../../config/logger");

// 🔹 Generate custom lead_id like LEAD_001
const generateLeadId = async () => {
  const lastLead = await Lead.findOne().sort({ createdAt: -1 });
  const lastNum = lastLead?.lead_id?.split("_")[1] || "000";
  const next = String(Number(lastNum) + 1).padStart(3, "0");
  return `LEAD_${next}`;
};

// ➕ CREATE
const createLead = async (req, res) => {
  try {
    const {
      fullName,
      emailId,
      mobileNumber,
      whatsAppNumber,
      purpose,
      projectName,
      message,
      notes,
      assignedTo,
      status,
      reminder,
      source,
    } = req.body;

    // Basic field validation
    if (!fullName || !emailId || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: "fullName, emailId, and mobileNumber are required",
      });
    }

    const lead_id = await generateLeadId();

    const newLead = new Lead({
      lead_id,
      fullName,
      emailId,
      mobileNumber,
      whatsAppNumber,
      purpose,
      projectName,
      message,
      notes,
      assignedTo,
      status,
      reminder,
      source,
    });

    const savedLead = await newLead.save();

    logger?.info(`✅ Lead created: ${lead_id} (${fullName})`);
    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: savedLead,
    });
  } catch (err) {
    logger?.error(`❌ Create lead error: ${err.message}`, { stack: err.stack });
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 📥 READ ALL
const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    logger?.info(`📋 Fetched ${leads.length} leads`);
    res.status(200).json({ success: true, data: leads });
  } catch (err) {
    logger?.error(`❌ Get leads error: ${err.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📋 READ BY ID
const getLeadById = async (req, res) => {
    const{lead_id} = req.params
  try {
    const lead = await Lead.findOne(lead_id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    logger?.info(`🔍 Lead fetched: ${lead.lead_id}`);
    res.status(200).json({ success: true, data: lead });
  } catch (err) {
    logger?.error(`❌ Fetch lead by ID error: ${err.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ♻️ UPDATE
const updateLead = async (req, res) => {
  try {
    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    logger?.info(`🔄 Lead updated: ${updated.lead_id}`);
    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: updated,
    });
  } catch (err) {
    logger?.error(`❌ Update lead error: ${err.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ❌ DELETE
const deleteLead = async (req, res) => {
  try {
    const { lead_id } = req.params;

    const deletedLead = await Lead.findOneAndDelete({ lead_id });

    if (!deletedLead) {
      return res.status(404).json({ success: false, message: "❌ Lead not found" });
    }

    logger?.info(`🗑️ Lead deleted successfully | lead_id: ${lead_id}`);
    return res.status(200).json({
      success: true,
      message: "✅ Lead deleted successfully",
    });
  } catch (err) {
    logger?.error(`❌ Error deleting lead | ${err.message}`);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
};
