import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid, FiCalendar, FiCheckCircle, FiCheckSquare,
  FiTrendingUp, FiShield, FiDatabase, FiUsers as FiRoles,
  FiCpu, FiLogOut, FiChevronLeft, FiMenu,
} from "react-icons/fi";
import useAuthStore from "../store/authStore";
import useEventStore from "../store/eventStore";
import toast from "react-hot-toast";
import { useState } from "react";
import "./Sidebar.css";

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { stats } = useEventStore();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  /* ─── Navigation Structure ─────────────────────────────── */
  const mainNav = [
    { to: "/organization", icon: FiGrid, label: "Dashboard", end: true },
    { to: "/organization/events", icon: FiCalendar, label: "Events" },
    {
      to: "/organization/approvals",
      icon: FiCheckCircle,
      label: "Approvals",
      badge: stats?.pendingApprovals || 0,
    },
  ];

  const categoryNav = [
    { to: "/organization/checklist", icon: FiCheckSquare, label: "Checklist" },
    { to: "/organization/marketing", icon: FiTrendingUp, label: "Marketing" },
    { to: "/organization/risk-matrix", icon: FiShield, label: "Risk Matrix" },
  ];

  const architectureNav = [
    { to: "/organization/db-schema", icon: FiDatabase, label: "DB Schema" },
    { to: "/organization/user-roles", icon: FiRoles, label: "User Roles" },
    { to: "/organization/tech-stack", icon: FiCpu, label: "Tech Stack" },
  ];

  const renderLink = (item) => (
    <NavLink
      key={item.to}
      to={item.to}
      end={item.end}
      className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
      title={collapsed ? item.label : ""}
    >
      <item.icon className="sidebar-link-icon" size={18} />
      {!collapsed && (
        <>
          <span className="sidebar-link-text">{item.label}</span>
          {item.badge > 0 && (
            <span className="sidebar-badge">{item.badge}</span>
          )}
        </>
      )}
      {collapsed && item.badge > 0 && <span className="sidebar-badge-dot" />}
    </NavLink>
  );

  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      {/* ─── Logo ──────────────────────────────────────────── */}
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <FiCalendar />
            </div>
            <span className="sidebar-logo-text">
              College<span className="logo-accent">Event</span>
            </span>
          </div>
        )}
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <FiMenu size={18} /> : <FiChevronLeft size={18} />}
        </button>
      </div>

      {/* ─── Main Navigation ───────────────────────────────── */}
      <nav className="sidebar-nav">
        <div className="sidebar-section">
          {!collapsed && <span className="sidebar-section-label">Main</span>}
          {mainNav.map(renderLink)}
        </div>

        <div className="sidebar-divider" />

        <div className="sidebar-section">
          {!collapsed && <span className="sidebar-section-label">Categories</span>}
          {categoryNav.map(renderLink)}
        </div>

        <div className="sidebar-divider" />

        <div className="sidebar-section">
          {!collapsed && <span className="sidebar-section-label">Architecture</span>}
          {architectureNav.map(renderLink)}
        </div>
      </nav>

      {/* ─── User Profile at Bottom ────────────────────────── */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.name}</span>
              <span className="sidebar-user-role">Organization</span>
            </div>
          )}
        </div>
        <button
          className="sidebar-logout"
          onClick={handleLogout}
          title="Logout"
        >
          <FiLogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
