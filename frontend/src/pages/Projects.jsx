import { useEffect, useState } from "react";
import API from "../api";

function Projects() {
  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const getProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Fetch projects error:", error);
      alert(error.response?.data?.message || "Failed to load projects. Please login again.");
    }
  };

  const createProject = async (e) => {
    e.preventDefault();

    try {
      await API.post("/projects", {
        title: form.title,
        description: form.description,
      });

      setForm({
        title: "",
        description: "",
      });

      await getProjects();
      alert("Project created successfully");
    } catch (error) {
      console.error("Create project error:", error);
      alert(error.response?.data?.message || "Project creation failed");
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <p className="eyebrow">Project Management</p>
        <h1 className="section-title">Projects</h1>
        <p className="muted">
          Create and manage your team projects.
        </p>
      </div>

      <div className="two-column">
        <div className="card form-card">
          <h2 className="card-title">Create Project</h2>

          <form onSubmit={createProject}>
            <input
              type="text"
              placeholder="Project title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />

            <textarea
              placeholder="Short description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <button className="btn full-btn" type="submit">
              Create Project
            </button>
          </form>
        </div>

        <div>
          {projects.length === 0 ? (
            <div className="empty-card">
              <h3>No projects yet</h3>
              <p>Create your first project.</p>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project._id} className="project-card">
                <span className="badge">Active Project</span>

                <h2>{project.title}</h2>
                <p className="muted">
                  {project.description || "No description added."}
                </p>

                <div className="meta-row">
                  <span>Project ID: {project._id}</span>
                  <span>Admin: {project.admin?.name || "You"}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Projects;