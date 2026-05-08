import { useEffect, useState } from "react";
import API from "../api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    project: "",
    dueDate: "",
  });

  const getProjects = async () => {
    try {
      const res = await API.get("/projects");
      const projectList = Array.isArray(res.data) ? res.data : [];
      setProjects(projectList);

      if (projectList.length > 0 && !form.project) {
        setForm((prev) => ({
          ...prev,
          project: projectList[0]._id,
        }));
      }
    } catch (error) {
      console.error("Fetch projects error:", error);
    }
  };

  const getTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Fetch tasks error:", error);
      alert(error.response?.data?.message || "Failed to load tasks. Please login again.");
    }
  };

  const createTask = async (e) => {
    e.preventDefault();

    if (!form.project) {
      alert("Please create a project first");
      return;
    }

    try {
      await API.post("/tasks", {
        title: form.title,
        description: form.description,
        project: form.project,
        dueDate: form.dueDate,
      });

      setForm({
        title: "",
        description: "",
        project: projects[0]?._id || "",
        dueDate: "",
      });

      await getTasks();
      alert("Task created successfully");
    } catch (error) {
      console.error("Create task error:", error);
      alert(error.response?.data?.message || "Task creation failed");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, { status });
      await getTasks();
    } catch (error) {
      console.error("Update status error:", error);
      alert(error.response?.data?.message || "Status update failed");
    }
  };

  useEffect(() => {
    getProjects();
    getTasks();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <p className="eyebrow">Task Execution</p>
        <h1 className="section-title">Tasks</h1>
        <p className="muted">
          Create, assign, and track tasks easily.
        </p>
      </div>

      <div className="two-column">
        <div className="card form-card">
          <h2 className="card-title">Create Task</h2>

          <form onSubmit={createTask}>
            <input
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />

            <textarea
              placeholder="Short task description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <select
              value={form.project}
              onChange={(e) => setForm({ ...form, project: e.target.value })}
              required
            >
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              required
            />

            <button className="btn full-btn" type="submit">
              Create Task
            </button>
          </form>
        </div>

        <div>
          {tasks.length === 0 ? (
            <div className="empty-card">
              <h3>No tasks yet</h3>
              <p>Create your first task to start tracking execution.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="task-card">
                <div className="task-top">
                  <h3>{task.title}</h3>
                  <span className={`status-pill ${task.status}`}>
                    {task.status}
                  </span>
                </div>

                <p className="muted">
                  {task.description || "No description added."}
                </p>

                <div className="meta-row">
                  <span>Project: {task.project?.title || "N/A"}</span>
                  <span>Assigned: {task.assignedTo?.name || "You"}</span>
                  <span>Due: {task.dueDate?.slice(0, 10)}</span>
                </div>

                <div className="task-buttons">
                  <button
                    className="todo"
                    onClick={() => updateStatus(task._id, "todo")}
                  >
                    Todo
                  </button>

                  <button
                    className="progress"
                    onClick={() => updateStatus(task._id, "in-progress")}
                  >
                    In Progress
                  </button>

                  <button
                    className="done"
                    onClick={() => updateStatus(task._id, "done")}
                  >
                    Done
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Tasks;