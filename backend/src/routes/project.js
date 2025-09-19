const express = require("express");
const { authenticate } = require("../middleware/auth");
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const router = express.Router();

// Get all projects for the user
router.get("/", authenticate, getProjects);

// Create new project
router.post("/", authenticate, createProject);

// Get project details
router.get("/:id", authenticate, getProjectById);

// Update project
router.put("/:id", authenticate, updateProject);

// Delete project
router.delete("/:id", authenticate, deleteProject);

module.exports = router;
