import { useState } from "react";
import API from "../api";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
      };

      const res = await API.post("/auth/signup", payload);

      alert(res.data.message || "Signup successful");
      window.location.href = "/login";
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Signup failed");
      } else if (error.request) {
        alert(
          "Cannot connect to backend. Check your Railway backend URL and VITE_API_URL."
        );
      } else {
        alert("Signup error: " + error.message);
      }
    } finally {
      setLoading(false);
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
            minLength="6"
          />

          <select name="role" value={form.role} onChange={handleChange}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>

          <button className="btn full-btn" type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;