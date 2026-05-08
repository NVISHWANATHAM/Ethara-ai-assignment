const express = require("express");
const Task = require("../models/Task");
const Project = require("../models/Project");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create task
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, project, assignedTo, dueDate } = req.body;

    if (!title || !project || !dueDate) {
      return res.status(400).json({
        message: "Title, project, and due date are required",
      });
    }

    const existingProject = await Project.findOne({
      _id: project,
      $or: [{ admin: req.user.id }, { members: req.user.id }],
    });

    if (!existingProject) {
      return res.status(404).json({
        message: "Project not found or access denied",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description || "",
      project,
      assignedTo: assignedTo || req.user.id,
      dueDate,
      createdBy: req.user.id,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("project", "title")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role");

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: error.message || "Task creation failed" });
  }
});

// Get tasks
router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }],
    })
      .populate("project", "title")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch tasks" });
  }
});

// Update task status/details
router.put("/:id", protect, async (req, res) => {
  try {
    const { title, description, status, dueDate, assignedTo } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }],
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found or access denied",
      });
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (dueDate) task.dueDate = dueDate;
    if (assignedTo) task.assignedTo = assignedTo;

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate("project", "title")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role");

    res.json(updatedTask);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: error.message || "Task update failed" });
  }
});

// Delete task
router.delete("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found or you are not allowed to delete it",
      });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: error.message || "Task delete failed" });
  }
});

module.exports = router;