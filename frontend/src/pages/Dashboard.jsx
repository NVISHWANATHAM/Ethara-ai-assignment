import { useEffect, useState } from "react";
import API from "../api";

function Dashboard() {
  const [data, setData] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    API.get("/dashboard")
      .then((res) => setData(res.data))
      .catch(() => alert("Please login first"));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <p className="eyebrow">Workspace Overview</p>
        <h1 className="section-title">Dashboard</h1>
        <p className="muted">
          Welcome {user?.name || "User"}. Track progress, workload, and task status.
        </p>
      </div>

      <div className="stat-grid">
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