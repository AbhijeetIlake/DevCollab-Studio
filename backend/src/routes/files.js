const express = require("express");
const { authenticate } = require("../middleware/auth");
const {
  saveFile,
  getFile,
  deleteFile,
  executeFile,
} = require("../controllers/fileController");

const router = express.Router();

// Save or update a file
// POST /api/projects/:projectId/files?path=/folder/file.js
router.post("/:projectId/files", authenticate, saveFile);

// Get a file
// GET /api/projects/:projectId/files?path=/folder/file.js
router.get("/:projectId/files", authenticate, getFile);

// Delete a file
// DELETE /api/projects/:projectId/files?path=/folder/file.js
router.delete("/:projectId/files", authenticate, deleteFile);

// Execute a file
// POST /api/projects/:projectId/execute
router.post("/:projectId/execute", authenticate, executeFile);

module.exports = router;
