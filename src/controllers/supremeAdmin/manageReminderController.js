const Project = require("../../models/projectReminderSchema");
const logger = require("../../config/logger");

// 🔹 CREATE Project
const createProjectReminder = async (req, res) => {
  try {
    const { projectName, assignees, deadline } = req.body;

    if (!projectName || !deadline || !assignees?.length) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newProject = new Project({
      projectName,
      assignees,
      deadline,
    });

    const savedProject = await newProject.save();
    logger?.info(`🆕 Project created: ${savedProject.projectName}`);
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: savedProject,
    });
  } catch (err) {
    logger?.error(`❌ Create project error: ${err.message}`, {
      stack: err.stack,
    });
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🔹 READ All Projects
const getAllProjectsReminder = async (req, res) => {
  try {
    const projects = await Project.find().sort({ deadline: 1 });
    res.status(200).json({ success: true, data: projects });
  } catch (err) {
    logger?.error(`❌ Fetch projects error: ${err.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 READ Project by ID
const getProjectReminderById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    logger?.error(`❌ Fetch project by ID error: ${err.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 UPDATE Project
const updateProjectReminder = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedProject) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    logger?.info(`🔄 Project updated: ${req.params.id}`);
    res.status(200).json({ success: true, data: updatedProject });
  } catch (err) {
    logger?.error(`❌ Update project error: ${err.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 DELETE Project
const deleteProjectReminder = async (req, res) => {
  try {
    const removedProject = await Project.findByIdAndDelete(req.params.id);
    if (!removedProject) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    logger?.info(`🗑️ Project deleted: ${req.params.id}`);
    res
      .status(200)
      .json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    logger?.error(`❌ Delete project error: ${err.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createProjectReminder,
  getAllProjectsReminder,
  getProjectReminderById,
  updateProjectReminder,
  deleteProjectReminder,
};
