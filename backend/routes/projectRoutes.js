const express = require("express");
const Project = require("../models/Project");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, description, members } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Project title is required" });
    }

    const project = await Project.create({
      title,
      description,
      admin: req.user.id,
      members: members || []
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    let projects;

    if (req.user.role === "admin") {
      projects = await Project.find({ admin: req.user.id })
        .populate("admin", "name email role")
        .populate("members", "name email role");
    } else {
      projects = await Project.find({ members: req.user.id })
        .populate("admin", "name email role")
        .populate("members", "name email role");
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

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
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { title, description, members } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, members },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;