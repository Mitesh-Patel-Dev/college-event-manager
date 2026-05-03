import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiCalendar, FiLogOut, FiUser, FiGrid } from "react-icons/fi";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import "./Navbar.css";

export default function Navbar() {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <div className="navbar-logo-icon">
            <FiCalendar />
          </div>
          <span className="navbar-logo-text">
            Event<span className="logo-accent">Hub</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="navbar-links">
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>Home</Link>
          <Link to="/events" className={`nav-link ${isActive("/events") ? "active" : ""}`}>Events</Link>
          {token && user?.role === "student" && (
            <Link to="/dashboard" className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}>
              Dashboard
            </Link>
          )}
          {token && user?.role === "admin" && (
            <Link to="/admin" className={`nav-link ${isActive("/admin") ? "active" : ""}`}>
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Auth Actions */}
        <div className="navbar-actions">
          {token ? (
            <div className="navbar-user">
              <div className="user-chip">
                <div className="user-avatar">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">{user?.name?.split(" ")[0]}</span>
                <span className={`role-badge ${user?.role === "admin" ? "admin" : "student"}`}>
                  {user?.role}
                </span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout} id="logout-btn">
                <FiLogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-ghost btn-sm" id="login-nav-btn">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="register-nav-btn">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} id="mobile-menu-btn">
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" className={`mobile-link ${isActive("/") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/events" className={`mobile-link ${isActive("/events") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>
            Events
          </Link>
          {token && user?.role === "student" && (
            <Link to="/dashboard" className="mobile-link" onClick={() => setMenuOpen(false)}>
              <FiUser size={15} /> Dashboard
            </Link>
          )}
          {token && user?.role === "admin" && (
            <Link to="/admin" className="mobile-link" onClick={() => setMenuOpen(false)}>
              <FiGrid size={15} /> Admin Panel
            </Link>
          )}
          {token ? (
            <button className="mobile-link logout" onClick={handleLogout}>
              <FiLogOut size={15} /> Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-full" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
