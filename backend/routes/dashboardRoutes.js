const express = require("express");
const Task = require("../models/Task");
const Project = require("../models/Project");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const taskFilter = {
      $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }],
    };

    const projectFilter = {
      $or: [{ admin: req.user.id }, { members: req.user.id }],
    };

    const tasks = await Task.find(taskFilter);
    const projects = await Project.find(projectFilter);

    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === "done").length;
    const inProgress = tasks.filter((task) => task.status === "in-progress").length;
    const todo = tasks.filter((task) => task.status === "todo").length;

    const overdue = tasks.filter(
      (task) => new Date(task.dueDate) < new Date() && task.status !== "done"
    ).length;

    res.json({
      total,
      completed,
      inProgress,
      todo,
      overdue,
      projects: projects.length,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: error.message || "Dashboard fetch failed" });
  }
});

module.exports = router;