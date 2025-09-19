const mongoose = require("mongoose");

const LockSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    filePath: { type: String, default: null }, // null for project-level lock, string for file-level
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Static method to check if a file or project is locked
LockSchema.statics.isLocked = async function (projectId, filePath = null) {
  const now = new Date();
  const lock = await this.findOne({
    project: projectId,
    filePath,
    expiresAt: { $gt: now },
  });
  return !!lock;
};

// Static method to create/update a lock
LockSchema.statics.acquireLock = async function (
  projectId,
  filePath,
  userId,
  durationMs = 30000
) {
  const expiresAt = new Date(Date.now() + durationMs);
  return this.findOneAndUpdate(
    { project: projectId, filePath },
    { user: userId, expiresAt },
    { upsert: true, new: true }
  );
};

// Static method to release a lock
LockSchema.statics.releaseLock = async function (projectId, filePath) {
  return this.deleteOne({ project: projectId, filePath });
};

module.exports = mongoose.model("Lock", LockSchema);
