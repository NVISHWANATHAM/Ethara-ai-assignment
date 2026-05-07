import { useState } from "react";
import API from "../api";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/signup", form);
      alert("Signup successful");
      window.location.href = "/login";
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <img src="/ethara-logo.png" alt="Company Logo" className="auth-logo" />

        <h1>Create account</h1>
        <p className="muted">
          Build a focused workspace for projects, teams, and task execution.
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
          <input
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <select name="role" value={form.role} onChange={handleChange}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>

          <button className="btn full-btn" type="submit">
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;