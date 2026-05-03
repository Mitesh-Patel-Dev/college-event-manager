import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiCalendar } from "react-icons/fi";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";
import "./AuthPages.css";

export default function LoginPage() {
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(form);
      toast.success(`Welcome back, ${data.user.name.split(" ")[0]}! 👋`);
      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-orb orb-a" />
      <div className="auth-bg-orb orb-b" />

      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon"><FiCalendar /></div>
          <span>EventHub</span>
        </div>

        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <div className="input-icon-wrapper">
              <FiMail className="input-icon" />
              <input
                id="login-email"
                type="email"
                name="email"
                className="form-control with-icon"
                placeholder="you@college.edu"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div className="input-icon-wrapper">
              <FiLock className="input-icon" />
              <input
                id="login-password"
                type="password"
                name="password"
                className="form-control with-icon"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={isLoading}
            id="login-submit-btn"
          >
            {isLoading ? <span className="spinner spinner-sm" /> : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">Create one here</Link>
        </p>

        {/* Admin hint */}
        <div className="auth-hint">
          <p>Default Admin: <code>admin@college.edu</code> / <code>admin123</code></p>
        </div>
      </div>
    </div>
  );
}
