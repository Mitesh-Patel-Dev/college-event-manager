import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiHash, FiBookOpen, FiCalendar } from "react-icons/fi";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";
import "./AuthPages.css";

export default function RegisterPage() {
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", department: "", rollNumber: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      const data = await register(form);
      toast.success(`Account created! Welcome, ${data.user.name.split(" ")[0]}! 🎉`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-orb orb-a" />
      <div className="auth-bg-orb orb-b" />

      <div className="auth-card auth-card-wide">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon"><FiCalendar /></div>
          <span>EventHub</span>
        </div>

        <h1 className="auth-title">Create Your Account</h1>
        <p className="auth-subtitle">Join thousands of students on EventHub</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name</label>
              <div className="input-icon-wrapper">
                <FiUser className="input-icon" />
                <input
                  id="reg-name" type="text" name="name"
                  className="form-control with-icon"
                  placeholder="Mitesh Patel"
                  value={form.name} onChange={handleChange} required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email Address</label>
              <div className="input-icon-wrapper">
                <FiMail className="input-icon" />
                <input
                  id="reg-email" type="email" name="email"
                  className="form-control with-icon"
                  placeholder="you@college.edu"
                  value={form.email} onChange={handleChange} required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div className="input-icon-wrapper">
                <FiLock className="input-icon" />
                <input
                  id="reg-password" type="password" name="password"
                  className="form-control with-icon"
                  placeholder="Min 6 characters"
                  value={form.password} onChange={handleChange} required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-roll">Roll Number</label>
              <div className="input-icon-wrapper">
                <FiHash className="input-icon" />
                <input
                  id="reg-roll" type="text" name="rollNumber"
                  className="form-control with-icon"
                  placeholder="e.g. CS2021001"
                  value={form.rollNumber} onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group form-group-full">
              <label className="form-label" htmlFor="reg-dept">Department</label>
              <div className="input-icon-wrapper">
                <FiBookOpen className="input-icon" />
                <input
                  id="reg-dept" type="text" name="department"
                  className="form-control with-icon"
                  placeholder="e.g. Computer Science"
                  value={form.department} onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={isLoading}
            id="register-submit-btn"
            style={{ marginTop: "0.5rem" }}
          >
            {isLoading ? <span className="spinner spinner-sm" /> : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}
