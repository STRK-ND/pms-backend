const Project = require("../../models/manageProjectSchema");
const logger = require("../../config/logger");

const generateProjectId =() =>{
    return `PROJECT_${Math.floor(100000 +  Math.random() * 900000)}`
}

// 🔹 Create Project
// 🔹 Create Project
const createProject = async (req, res) => {
  try {
    const project_id = generateProjectId(); // ← invoke the generator

    const newProject = new Project({
      project_id,
      ...req.body,
    });

    const saved = await newProject.save();

    logger?.info(`🆕 Project created: ${saved.project_id}`);
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: saved,
    });
  } catch (err) {
    logger?.error(`❌ Create project error: ${err.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// 🔹 Get All Projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: projects });
  } catch (err) {
    logger?.error(`❌ Fetch projects error: ${err.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Get Project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    logger?.error(`❌ Fetch project by ID error: ${err.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Update Project
const updateProject = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    logger?.info(`🔄 Project updated: ${req.params.id}`);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    logger?.error(`❌ Update project error: ${err.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Delete Project
const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    logger?.info(`🗑️ Project deleted: ${req.params.id}`);
    res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    logger?.error(`❌ Delete project error: ${err.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
