import { useEffect, useState } from "react";
import API from "../api";

function Projects() {
  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    members: ""
  });

  const getProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createProject = async (e) => {
    e.preventDefault();

    try {
      await API.post("/projects", {
        title: form.title,
        description: form.description,
        members: form.members
          ? form.members.split(",").map((id) => id.trim())
          : []
      });

      setForm({
        title: "",
        description: "",
        members: ""
      });

      getProjects();
    } catch (error) {
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
          Create focused project spaces without long, messy input columns.
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
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />

            <input
              type="text"
              placeholder="Member IDs, comma separated"
              value={form.members}
              onChange={(e) => setForm({ ...form, members: e.target.value })}
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
              <p>Create your first workspace project.</p>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project._id} className="project-card">
                <span className="badge">Active Project</span>

                <h2>{project.title}</h2>
                <p className="muted">{project.description}</p>

                <div className="meta-row">
                  <span>Team Workspace</span>
                  <span>Role Based Access</span>
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