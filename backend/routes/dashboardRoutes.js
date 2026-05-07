const express = require("express");
const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const filter =
      req.user.role === "admin"
        ? { createdBy: req.user.id }
        : { assignedTo: req.user.id };

    const tasks = await Task.find(filter);

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
      overdue
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;