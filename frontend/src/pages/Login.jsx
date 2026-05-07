import { useState } from "react";
import API from "../api";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.location.href = "/dashboard";
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <img src="/ethara-logo.png" alt="Company Logo" className="auth-logo" />

        <h1>Welcome back</h1>
        <p className="muted">
          Continue managing your team workspace.
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
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

          <button className="btn full-btn" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;