import { useEffect, useState, useMemo } from "react";
import {
  FiPlus, FiCalendar, FiUsers, FiClock,
  FiTrendingUp, FiMapPin, FiAlertCircle,
  FiX, FiEdit2, FiTrash2,
} from "react-icons/fi";
import toast from "react-hot-toast";
import useEventStore from "../store/eventStore";
import "./OrganizationDashboard.css";

const CATEGORIES = [
  "Workshop", "Seminar", "Cultural", "Sports",
  "Technical", "Guest Lecture", "Hackathon", "Other",
];
const STATUSES = ["upcoming", "ongoing", "completed", "cancelled"];

const EMPTY_FORM = {
  title: "", description: "", category: "Workshop", date: "",
  time: "", venue: "", max_capacity: "", organizer: "", status: "upcoming",
  budget: "", approval_status: "pending",
};

// ─── Simple SVG Line Chart ─────────────────────────────────────
function TrendChart({ data, period }) {
  const width = 600;
  const height = 180;
  const padX = 40;
  const padY = 25;

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const now = new Date();
    const daysBack = period === "7d" ? 7 : period === "12m" ? 365 : 30;
    const cutoff = new Date(now.getTime() - daysBack * 86400000);
    return data.filter((d) => new Date(d._id) >= cutoff);
  }, [data, period]);

  if (filteredData.length === 0) {
    return (
      <div className="chart-empty">
        <p>No registration data for this period</p>
      </div>
    );
  }

  const maxVal = Math.max(...filteredData.map((d) => d.count), 1);
  const points = filteredData.map((d, i) => {
    const x = padX + (i / Math.max(filteredData.length - 1, 1)) * (width - padX * 2);
    const y = padY + (1 - d.count / maxVal) * (height - padY * 2);
    return { x, y, count: d.count, date: d._id };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${height - padY} Z`;

  // Y-axis labels
  const yLabels = [0, Math.round(maxVal / 2), maxVal];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="trend-chart-svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#89b4fa" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#89b4fa" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#89b4fa" />
          <stop offset="100%" stopColor="#cba6f7" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {yLabels.map((val) => {
        const y = padY + (1 - val / maxVal) * (height - padY * 2);
        return (
          <g key={val}>
            <line x1={padX} y1={y} x2={width - padX} y2={y} stroke="rgba(137,180,250,0.08)" strokeWidth="1" />
            <text x={padX - 8} y={y + 4} fill="#7f849c" fontSize="10" textAnchor="end">{val}</text>
          </g>
        );
      })}
      {/* Area fill */}
      <path d={areaPath} fill="url(#chartGrad)" />
      {/* Line */}
      <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#89b4fa" stroke="#11111b" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

// ─── Dashboard Component ────────────────────────────────────────
export default function OrganizationDashboard() {
  const {
    events, fetchEvents, createEvent, updateEvent, deleteEvent,
    fetchEventRegistrations, fetchEventStats,
    stats, trendData, activeEventsList, isLoading,
  } = useEventStore();

  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [viewingRegs, setViewingRegs] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [chartPeriod, setChartPeriod] = useState("30d");

  useEffect(() => {
    fetchEvents();
    fetchEventStats();
  }, []);

  // ─── Form Handlers ──────────────────────────────────────
  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingEvent(null);
    setShowModal(true);
  };

  const openEdit = (event) => {
    setForm({
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.date?.split("T")[0] || "",
      time: event.time,
      venue: event.venue,
      max_capacity: event.max_capacity,
      organizer: event.organizer,
      status: event.status,
      budget: event.budget || "",
      approval_status: event.approval_status || "pending",
    });
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingEvent) {
        await updateEvent(editingEvent._id, form);
        toast.success("Event updated successfully");
      } else {
        await createEvent(form);
        toast.success("Event created successfully 🎉");
      }
      setShowModal(false);
      fetchEventStats();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (event) => {
    if (!window.confirm(`Delete "${event.title}"?`)) return;
    try {
      await deleteEvent(event._id);
      toast.success("Event deleted");
      fetchEventStats();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleViewRegistrations = async (event) => {
    try {
      const data = await fetchEventRegistrations(event._id);
      setViewingRegs({ event: data.event, registrations: data.registrations });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });

  const approvalColor = (s) =>
    s === "approved" ? "green" : s === "rejected" ? "red" : "yellow";

  return (
    <div className="org-dashboard">
      {/* ─── Header ──────────────────────────────────────── */}
      <div className="org-dash-header">
        <div>
          <h1 className="org-dash-title">Dashboard</h1>
          <p className="org-dash-subtitle">Overview of your campus events</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate} id="create-event-btn">
          <FiPlus /> Create Event
        </button>
      </div>

      {/* ─── Stats Cards ─────────────────────────────────── */}
      <div className="org-stats-grid">
        {[
          {
            icon: FiCalendar, label: "Active Events",
            value: stats?.activeEvents ?? 0,
            trend: "+18%", color: "blue",
          },
          {
            icon: FiUsers, label: "Total Applicants",
            value: stats?.totalApplicants ?? 0,
            trend: "+32%", color: "green",
          },
          {
            icon: FiAlertCircle, label: "Pending Approvals",
            value: stats?.pendingApprovals ?? 0,
            trend: "Needs action", color: "red", isAlert: true,
          },
          {
            icon: FiTrendingUp, label: "Total Capacity",
            value: stats?.totalCapacity ?? 0,
            trend: `${stats?.fillRate ?? 0}% filled`, color: "mauve",
          },
        ].map((s) => (
          <div className={`org-stat-card org-stat-${s.color}`} key={s.label}>
            <div className="org-stat-top">
              <div className={`org-stat-icon-wrap org-stat-icon-${s.color}`}>
                <s.icon size={18} />
              </div>
              <span className={`org-stat-trend ${s.isAlert ? "alert" : ""}`}>
                {s.trend}
              </span>
            </div>
            <span className="org-stat-value">{s.value.toLocaleString()}</span>
            <span className="org-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ─── Main Content: Chart + Active Events ─────────── */}
      <div className="org-dash-content">
        {/* Chart Panel */}
        <div className="org-chart-card">
          <div className="org-chart-header">
            <h2 className="org-chart-title">Registration Trend</h2>
            <div className="org-chart-periods">
              {["7d", "30d", "12m"].map((p) => (
                <button
                  key={p}
                  className={`org-period-btn ${chartPeriod === p ? "active" : ""}`}
                  onClick={() => setChartPeriod(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="org-chart-body">
            <TrendChart data={trendData} period={chartPeriod} />
          </div>
        </div>

        {/* Active Events Panel */}
        <div className="org-active-card">
          <div className="org-active-header">
            <h2 className="org-active-title">Active Events</h2>
            <a href="/organization/events" className="org-view-all">View All</a>
          </div>
          <div className="org-active-list">
            {(activeEventsList || []).length === 0 ? (
              <p className="org-active-empty">No active events yet</p>
            ) : (
              activeEventsList.map((evt) => (
                <div className="org-active-item" key={evt._id}>
                  <div className={`org-active-dot dot-${approvalColor(evt.approval_status)}`} />
                  <div className="org-active-info">
                    <span className="org-active-name">{evt.title}</span>
                    <span className="org-active-meta">
                      <FiCalendar size={11} /> {formatDate(evt.date)}
                      <span className="meta-sep">·</span>
                      <FiMapPin size={11} /> {evt.venue}
                    </span>
                  </div>
                  <span className={`badge badge-${approvalColor(evt.approval_status)}`}>
                    {evt.approval_status?.toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ─── Create/Edit Modal ────────────────────────────── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingEvent ? "Edit Event" : "Create New Event"}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)} id="modal-close-btn">
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Event Title *</label>
                <input name="title" className="form-control"
                  placeholder="e.g. React.js Workshop 2025"
                  value={form.title} onChange={handleChange} required
                  id="event-title-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea name="description" className="form-control"
                  placeholder="Describe the event..."
                  value={form.description} onChange={handleChange}
                  rows={3} required id="event-desc-input"
                  style={{ resize: "vertical" }} />
              </div>

              <div className="modal-grid-2">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select name="category" className="form-control"
                    value={form.category} onChange={handleChange} id="event-cat-select">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select name="status" className="form-control"
                    value={form.status} onChange={handleChange} id="event-status-select">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input type="date" name="date" className="form-control"
                    value={form.date} onChange={handleChange} required id="event-date-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Time *</label>
                  <input type="text" name="time" className="form-control"
                    placeholder="e.g. 10:00 AM - 1:00 PM"
                    value={form.time} onChange={handleChange} required id="event-time-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Venue *</label>
                  <input type="text" name="venue" className="form-control"
                    placeholder="e.g. Seminar Hall A"
                    value={form.venue} onChange={handleChange} required id="event-venue-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Capacity *</label>
                  <input type="number" name="max_capacity" className="form-control"
                    placeholder="e.g. 100"
                    value={form.max_capacity} onChange={handleChange}
                    required min={1} id="event-capacity-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Budget (₹)</label>
                  <input type="number" name="budget" className="form-control"
                    placeholder="e.g. 5000"
                    value={form.budget} onChange={handleChange}
                    min={0} id="event-budget-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Organizer</label>
                  <input type="text" name="organizer" className="form-control"
                    placeholder="e.g. Computer Science Dept."
                    value={form.organizer} onChange={handleChange} id="event-organizer-input" />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost"
                  onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary"
                  disabled={submitting} id="event-submit-btn">
                  {submitting ? <span className="spinner spinner-sm" /> : null}
                  {editingEvent ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Registrations Viewer Modal ───────────────────── */}
      {viewingRegs && (
        <div className="modal-overlay" onClick={() => setViewingRegs(null)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Applications</h2>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  {viewingRegs.event.title}
                </p>
              </div>
              <button className="modal-close" onClick={() => setViewingRegs(null)}>
                <FiX />
              </button>
            </div>

            <p className="regs-count">
              {viewingRegs.registrations.length} student
              {viewingRegs.registrations.length !== 1 ? "s" : ""} applied
            </p>

            {viewingRegs.registrations.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>
                No students have applied yet.
              </p>
            ) : (
              <div className="regs-list">
                {viewingRegs.registrations.map((r, i) => (
                  <div className="reg-row" key={r._id}>
                    <span className="reg-row-num">{i + 1}</span>
                    <div className="reg-row-avatar">
                      {r.student?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="reg-row-info">
                      <span className="reg-row-name">{r.student?.name}</span>
                      <span className="reg-row-meta">
                        {r.student?.email}
                        {r.student?.rollNumber && ` · ${r.student.rollNumber}`}
                        {r.student?.department && ` · ${r.student.department}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
