const express = require("express");
const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, description, project, assignedTo, dueDate } = req.body;

    if (!title || !project || !assignedTo || !dueDate) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      dueDate,
      createdBy: req.user.id
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find({ createdBy: req.user.id })
        .populate("project", "title")
        .populate("assignedTo", "name email role");
    } else {
      tasks = await Task.find({ assignedTo: req.user.id })
        .populate("project", "title")
        .populate("assignedTo", "name email role");
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const { title, description, status, dueDate, assignedTo } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role === "member" && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (req.user.role === "member") {
      task.status = status || task.status;
    } else {
      task.title = title || task.title;
      task.description = description || task.description;
      task.status = status || task.status;
      task.dueDate = dueDate || task.dueDate;
      task.assignedTo = assignedTo || task.assignedTo;
    }

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;