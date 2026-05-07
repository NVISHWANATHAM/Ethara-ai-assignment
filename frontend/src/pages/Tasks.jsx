import { useEffect, useState } from "react";
import API from "../api";

function Tasks() {
  const [tasks, setTasks] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    project: "",
    assignedTo: "",
    dueDate: ""
  });

  const getTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch {
      alert("Please login first");
    }
  };

  const createTask = async (e) => {
    e.preventDefault();

    try {
      await API.post("/tasks", form);

      setForm({
        title: "",
        description: "",
        project: "",
        assignedTo: "",
        dueDate: ""
      });

      getTasks();
    } catch (error) {
      alert(error.response?.data?.message || "Only admin can create task");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, { status });
      getTasks();
    } catch {
      alert("Status update failed");
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <p className="eyebrow">Task Execution</p>
        <h1 className="section-title">Tasks</h1>
        <p className="muted">
          Assign, track, and update work with a clean execution board.
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
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <input
              placeholder="Project ID"
              value={form.project}
              onChange={(e) => setForm({ ...form, project: e.target.value })}
              required
            />

            <input
              placeholder="Assigned user ID"
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              required
            />

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
                  <span>Assigned: {task.assignedTo?.name || "N/A"}</span>
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