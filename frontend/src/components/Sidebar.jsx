import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid, FiCalendar, FiUsers, FiLogOut, FiChevronLeft,
  FiMenu,
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

  const navItems = [
    { to: "/organization", icon: FiGrid, label: "Dashboard", end: true },
    { to: "/organization/events", icon: FiCalendar, label: "Events" },
    {
      to: "/organization/applications",
      icon: FiUsers,
      label: "Applications",
      badge: stats?.pendingApprovals || 0,
    },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      {/* Logo */}
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <FiCalendar />
            </div>
            <span className="sidebar-logo-text">
              Event<span className="logo-accent">Hub</span>
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

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
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
            {collapsed && item.badge > 0 && (
              <span className="sidebar-badge-dot" />
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile at Bottom */}
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
