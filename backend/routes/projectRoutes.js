const express = require("express");
const Project = require("../models/Project");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create project
router.post("/", protect, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Project title is required" });
    }

    const project = await Project.create({
      title: title.trim(),
      description: description || "",
      admin: req.user.id,
      members: [req.user.id],
    });

    const populatedProject = await Project.findById(project._id)
      .populate("admin", "name email role")
      .populate("members", "name email role");

    res.status(201).json(populatedProject);
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ message: error.message || "Project creation failed" });
  }
});

// Get projects
router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ admin: req.user.id }, { members: req.user.id }],
    })
      .populate("admin", "name email role")
      .populate("members", "name email role")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch projects" });
  }
});

// Get single project
router.get("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("admin", "name email role")
      .populate("members", "name email role");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch project" });
  }
});

// Update project
router.put("/:id", protect, async (req, res) => {
  try {
    const { title, description } = req.body;

    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        admin: req.user.id,
      },
      {
        title,
        description,
      },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found or you are not allowed to update it",
      });
    }

    res.json(project);
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({ message: error.message || "Project update failed" });
  }
});

// Delete project
router.delete("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      admin: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found or you are not allowed to delete it",
      });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ message: error.message || "Project delete failed" });
  }
});

module.exports = router;