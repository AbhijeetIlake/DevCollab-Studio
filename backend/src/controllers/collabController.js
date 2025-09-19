const Invite = require("../models/Invite");
const Project = require("../models/Project");
const User = require("../models/User");

// @desc Send collaboration invite
exports.sendInvite = async (req, res) => {
  try {
    const { email, role } = req.body;
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    if (!project.owner.equals(req.user._id)) {
      return res.status(403).json({ error: "Only owner can send invites" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const existingInvite = await Invite.findOne({
      project: projectId,
      receiver: user._id,
      status: 'pending'
    });
    if (existingInvite)
      return res.status(400).json({ error: "Invite already sent" });

    const invite = new Invite({
      project: projectId,
      sender: req.user._id,
      receiver: user._id,
      role,
    });
    await invite.save();

    res.status(201).json({ message: "Invite sent", invite });
  } catch (error) {
    console.error("Send invite error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc Accept invite
exports.acceptInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const invite = await Invite.findById(inviteId);
    if (!invite) return res.status(404).json({ error: "Invite not found" });
    if (!invite.receiver.equals(req.user._id))
      return res.status(403).json({ error: "Access denied" });

    const project = await Project.findById(invite.project);
    if (!project) return res.status(404).json({ error: "Project not found" });

    project.collaborators.push({ user: req.user._id, role: invite.role });
    await project.save();

    invite.status = 'accepted';
    invite.respondedAt = new Date();
    await invite.save();
    
    res.json({ message: "Invite accepted", project });
  } catch (error) {
    console.error("Accept invite error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc Decline invite
exports.declineInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const invite = await Invite.findById(inviteId);
    if (!invite) return res.status(404).json({ error: "Invite not found" });
    if (!invite.receiver.equals(req.user._id))
      return res.status(403).json({ error: "Access denied" });

    invite.status = 'declined';
    invite.respondedAt = new Date();
    await invite.save();
    
    res.json({ message: "Invite declined" });
  } catch (error) {
    console.error("Decline invite error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc List all pending invites for the logged-in user
exports.listInvites = async (req, res) => {
  try {
    const invites = await Invite.find({ 
      receiver: req.user._id,
      status: 'pending'
    })
      .populate("sender", "username email")
      .populate("project", "name description");

    res.json(invites);
  } catch (error) {
    console.error("List invites error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
