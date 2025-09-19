const Lock = require("../models/Lock");

// Middleware to prevent editing a locked file/project
const checkLock = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const filePath = req.body.filePath || null;

    const locked = await Lock.isLocked(projectId, filePath);
    if (locked)
      return res.status(423).json({ error: "Resource is currently locked" });

    next();
  } catch (error) {
    console.error("Lock middleware error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Middleware to acquire lock automatically for a file/project
const acquireLock = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const filePath = req.body.filePath || null;
    const userId = req.user._id;

    await Lock.acquireLock(projectId, filePath, userId, 30000); // 30 sec default lock
    next();
  } catch (error) {
    console.error("Acquire lock error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Middleware to release lock (optional, can also rely on expiration)
const releaseLock = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const filePath = req.body.filePath || null;

    await Lock.releaseLock(projectId, filePath);
    next();
  } catch (error) {
    console.error("Release lock error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { checkLock, acquireLock, releaseLock };
