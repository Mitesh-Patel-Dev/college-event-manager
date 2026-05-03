import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar, FiMapPin, FiClock, FiXCircle,
  FiUser, FiHash, FiBookOpen, FiGrid,
} from "react-icons/fi";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";
import useRegistrationStore from "../store/registrationStore";
import "./StudentDashboard.css";

const STATUS_COLORS = {
  upcoming: "blue", ongoing: "green", completed: "yellow", cancelled: "red",
};

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { myRegistrations, fetchMyRegistrations, cancelRegistration, isLoading } =
    useRegistrationStore();

  useEffect(() => {
    fetchMyRegistrations();
  }, []);

  const handleCancel = async (eventId, eventTitle) => {
    if (!window.confirm(`Cancel registration for "${eventTitle}"?`)) return;
    try {
      await cancelRegistration(eventId);
      toast.success("Registration cancelled");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const upcoming = myRegistrations.filter(
    (r) => r.event?.status === "upcoming"
  );
  const past = myRegistrations.filter(
    (r) => r.event?.status !== "upcoming"
  );

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });

  return (
    <div className="page-wrapper student-dashboard">
      <div className="container">
        {/* ─── Profile Header ──────────────────────────────── */}
        <div className="dashboard-header">
          <div className="profile-card">
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{user?.name}</h1>
              <p className="profile-email">{user?.email}</p>
              <div className="profile-meta">
                {user?.rollNumber && (
                  <span className="profile-meta-item">
                    <FiHash size={12} /> {user.rollNumber}
                  </span>
                )}
                {user?.department && (
                  <span className="profile-meta-item">
                    <FiBookOpen size={12} /> {user.department}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="dashboard-stats">
            <div className="dash-stat-card">
              <span className="dash-stat-num">{myRegistrations.length}</span>
              <span className="dash-stat-label">Total Registered</span>
            </div>
            <div className="dash-stat-card">
              <span className="dash-stat-num" style={{ color: "var(--accent-green)" }}>
                {upcoming.length}
              </span>
              <span className="dash-stat-label">Upcoming</span>
            </div>
            <div className="dash-stat-card">
              <span className="dash-stat-num" style={{ color: "var(--text-muted)" }}>
                {past.length}
              </span>
              <span className="dash-stat-label">Past Events</span>
            </div>
          </div>
        </div>

        {/* ─── Upcoming Registrations ───────────────────────── */}
        <section className="dashboard-section">
          <div className="dash-section-header">
            <h2 className="dash-section-title">
              <FiCalendar /> Upcoming Events
            </h2>
            <Link to="/events" className="btn btn-ghost btn-sm">Browse More</Link>
          </div>

          {isLoading ? (
            <div className="spinner" />
          ) : upcoming.length > 0 ? (
            <div className="reg-list">
              {upcoming.map((reg) => (
                <RegistrationItem
                  key={reg._id}
                  reg={reg}
                  onCancel={handleCancel}
                  formatDate={formatDate}
                  canCancel
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FiGrid size={48} />
              <h3>No upcoming events</h3>
              <p>
                <Link to="/events" style={{ color: "var(--accent-blue)" }}>
                  Browse events
                </Link>{" "}
                and register for something exciting!
              </p>
            </div>
          )}
        </section>

        {/* ─── Past Events ─────────────────────────────────── */}
        {past.length > 0 && (
          <section className="dashboard-section">
            <div className="dash-section-header">
              <h2 className="dash-section-title">Past Events</h2>
            </div>
            <div className="reg-list">
              {past.map((reg) => (
                <RegistrationItem
                  key={reg._id}
                  reg={reg}
                  onCancel={handleCancel}
                  formatDate={formatDate}
                  canCancel={false}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ─── Sub-component: Registration Item ──────────────────────── */
function RegistrationItem({ reg, onCancel, formatDate, canCancel }) {
  const { event } = reg;
  if (!event) return null;

  const STATUS_COLORS = {
    upcoming: "blue", ongoing: "green", completed: "yellow", cancelled: "red",
  };

  return (
    <div className="reg-item">
      <div className="reg-item-info">
        <div className="reg-item-top">
          <span className={`badge badge-${STATUS_COLORS[event.status] || "blue"}`}>
            {event.status}
          </span>
          <span className="badge badge-blue">{event.category}</span>
        </div>
        <h3 className="reg-item-title">{event.title}</h3>
        <div className="reg-item-meta">
          <span><FiCalendar size={12} /> {formatDate(event.date)}</span>
          <span><FiClock size={12} /> {event.time}</span>
          <span><FiMapPin size={12} /> {event.venue}</span>
        </div>
      </div>
      <div className="reg-item-actions">
        <Link to={`/events/${event._id}`} className="btn btn-ghost btn-sm">
          View
        </Link>
        {canCancel && (
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onCancel(event._id, event.title)}
            id={`cancel-reg-${event._id}`}
          >
            <FiXCircle size={13} /> Cancel
          </button>
        )}
      </div>
    </div>
  );
}
