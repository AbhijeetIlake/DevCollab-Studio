const express = require("express");
const { authenticate } = require("../middleware/auth");
const {
  sendInvite,
  acceptInvite,
  declineInvite,
  listInvites,
} = require("../controllers/collabController");

const router = express.Router();

// Send a collaboration invite
// POST /api/collab/:projectId/invite
router.post("/:projectId/invite", authenticate, sendInvite);

// Accept an invite
// POST /api/collab/:inviteId/accept
router.post("/:inviteId/accept", authenticate, acceptInvite);

// Decline an invite
// POST /api/collab/:inviteId/decline
router.post("/:inviteId/decline", authenticate, declineInvite);

// List all pending invites for the user
// GET /api/collab/invites
router.get("/invites", authenticate, listInvites);

module.exports = router;
