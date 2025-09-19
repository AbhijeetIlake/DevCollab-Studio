const { spawn } = require("child_process");
const Project = require("../models/Project");

// 🔹 Helper: check user access to project
function hasAccess(project, userId) {
  return (
    project.owner.equals(userId) ||
    project.collaborators.some((c) => c.user.equals(userId))
  );
}

// @desc Save or update a file
exports.saveFile = async (req, res) => {
  try {
    const { path, content, language } = req.query;
    if (!path || !content)
      return res.status(400).json({ error: "File path and content required" });

    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    if (!hasAccess(project, req.user._id))
      return res.status(403).json({ error: "Access denied" });

    let file = project.files.find((f) => f.path === path);

    if (file) {
      if (file.snapshots.length >= 5) file.snapshots.shift();
      file.snapshots.push({ content: file.content, author: req.user._id });
      file.content = content;
      file.language = language;
    } else {
      file = {
        name: path.split("/").pop(),
        path,
        content,
        language,
        snapshots: [{ content, author: req.user._id }],
      };
      project.files.push(file);
    }

    await project.save();
    res.json(file);
  } catch (error) {
    console.error("Save file error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc Get a file
exports.getFile = async (req, res) => {
  try {
    const { path } = req.query;
    if (!path) return res.status(400).json({ error: "File path required" });

    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    if (!hasAccess(project, req.user._id))
      return res.status(403).json({ error: "Access denied" });

    const file = project.files.find((f) => f.path === path);
    if (!file) return res.status(404).json({ error: "File not found" });

    res.json(file);
  } catch (error) {
    console.error("Get file error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc Delete a file
exports.deleteFile = async (req, res) => {
  try {
    const { path } = req.query;
    if (!path) return res.status(400).json({ error: "File path required" });

    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    if (!hasAccess(project, req.user._id))
      return res.status(403).json({ error: "Access denied" });

    project.files = project.files.filter((f) => f.path !== path);
    await project.save();

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete file error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc Execute a file
exports.executeFile = async (req, res) => {
  try {
    const { filePath, language } = req.body;
    if (!filePath || !language)
      return res.status(400).json({ error: "File path and language required" });

    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const file = project.files.find((f) => f.path === filePath);
    if (!file) return res.status(404).json({ error: "File not found" });

    let command, args;
    if (["javascript", "typescript"].includes(language)) {
      command = "node";
      args = ["-e", file.content];
    } else if (language === "python") {
      command = "python";
      args = ["-c", file.content];
    } else {
      return res.status(400).json({ error: "Unsupported language" });
    }

    let output = "",
      errorOut = "";
    const child = spawn(command, args, {
      timeout: 30000,
      cwd: "/tmp",
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (data) => (output += data.toString()));
    child.stderr.on("data", (data) => (errorOut += data.toString()));

    child.on("close", (code) =>
      res.json({ output, error: errorOut, exitCode: code })
    );
    child.on("error", (err) =>
      res.json({ output: "", error: err.message, exitCode: -1 })
    );
  } catch (error) {
    console.error("Execute file error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
