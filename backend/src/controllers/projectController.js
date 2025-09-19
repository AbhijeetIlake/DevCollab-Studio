const Project = require("../models/Project");

// @desc Get all projects of the logged-in user
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { "collaborators.user": req.user._id }],
    })
      .populate("owner", "username email")
      .populate("collaborators.user", "username email");

    res.json(projects);
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc Create new project
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = new Project({
      name,
      description,
      owner: req.user._id,
      files: [
        {
          name: "index.js",
          path: "/index.js",
          content:
            '// Welcome to your new project!\nconsole.log("Hello, DevCollab!");',
          language: "javascript",
        },
      ],
    });

    await project.save();
    await project.populate("owner", "username email");

    res.status(201).json(project);
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc Get project details by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "username email")
      .populate("collaborators.user", "username email");

    if (!project) return res.status(404).json({ error: "Project not found" });

    const hasAccess =
      project.owner._id.equals(req.user._id) ||
      project.collaborators.some((c) => c.user._id.equals(req.user._id));

    if (!hasAccess) return res.status(403).json({ error: "Access denied" });

    res.json(project);
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc Update project by ID
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    if (!project.owner.equals(req.user._id))
      return res.status(403).json({ error: "Access denied" });

    Object.assign(project, req.body);
    await project.save();

    res.json(project);
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc Delete project by ID
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    if (!project.owner.equals(req.user._id))
      return res.status(403).json({ error: "Access denied" });

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
