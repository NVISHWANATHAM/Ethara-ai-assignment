import { useEffect, useState } from "react";
import API from "../api";

function Dashboard() {
  const [data, setData] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0,
    projects: 0,
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const getDashboard = async () => {
    try {
      const res = await API.get("/dashboard");
      setData(res.data);
    } catch (error) {
      console.error("Dashboard error:", error);
      alert(error.response?.data?.message || "Please login first");
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    getDashboard();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <p className="eyebrow">Workspace Overview</p>
        <h1 className="section-title">Dashboard</h1>
        <p className="muted">
          Welcome {user?.name || "User"}. Track projects, tasks, and progress.
        </p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <h3>Projects</h3>
          <p>{data.projects || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p>{data.total || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Completed</h3>
          <p>{data.completed || 0}</p>
        </div>

        <div className="stat-card">
          <h3>In Progress</h3>
          <p>{data.inProgress || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Overdue</h3>
          <p>{data.overdue || 0}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;