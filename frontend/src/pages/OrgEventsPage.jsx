import { useEffect, useState } from "react";
import {
  FiSearch, FiPlus, FiCalendar, FiMapPin,
  FiClock, FiUsers, FiDollarSign, FiEdit2,
  FiTrash2, FiCheckCircle, FiXCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";
import useEventStore from "../store/eventStore";
import "./OrgEventsPage.css";

const TABS = [
  { key: "all", label: "All Events" },
  { key: "approved", label: "Approved" },
  { key: "pending", label: "Pending" },
  { key: "rejected", label: "Rejected" },
];

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

export default function OrgEventsPage() {
  const {
    events, fetchEvents, createEvent, updateEvent, deleteEvent,
    updateApprovalStatus, isLoading,
  } = useEventStore();

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const filtered = events.filter((e) => {
    if (activeTab !== "all" && e.approval_status !== activeTab) return false;
    if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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
        toast.success("Event updated");
      } else {
        await createEvent(form);
        toast.success("Event created 🎉");
      }
      setShowModal(false);
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
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleApproval = async (id, status) => {
    try {
      await updateApprovalStatus(id, status);
      toast.success(`Event ${status}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });

  const formatBudget = (b) =>
    b ? `₹${Number(b).toLocaleString("en-IN")}` : "—";

  const approvalColor = (s) =>
    s === "approved" ? "green" : s === "rejected" ? "red" : "yellow";

  return (
    <div className="org-events-page">
      {/* Header */}
      <div className="org-events-header">
        <div>
          <h1 className="org-events-title">Events</h1>
          <p className="org-events-subtitle">Browse and manage all campus events</p>
        </div>
        <div className="org-events-header-actions">
          <div className="org-search-box">
            <FiSearch className="org-search-icon" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="org-search-input"
              id="org-event-search"
            />
          </div>
          <button className="btn btn-primary" onClick={openCreate} id="org-create-event-btn">
            <FiPlus /> Create Event
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="org-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`org-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Event Cards Grid */}
      {isLoading ? (
        <div className="spinner" style={{ marginTop: "3rem" }} />
      ) : filtered.length > 0 ? (
        <div className="org-events-grid">
          {filtered.map((event) => (
            <OrgEventCard
              key={event._id}
              event={event}
              onEdit={openEdit}
              onDelete={handleDelete}
              onApprove={(id) => handleApproval(id, "approved")}
              onReject={(id) => handleApproval(id, "rejected")}
              formatDate={formatDate}
              formatBudget={formatBudget}
              approvalColor={approvalColor}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state" style={{ marginTop: "3rem" }}>
          <FiCalendar size={48} />
          <h3>No events found</h3>
          <p>Create your first event or adjust filters</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingEvent ? "Edit Event" : "Create New Event"}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <FiXCircle />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Event Title *</label>
                <input name="title" className="form-control"
                  placeholder="e.g. AI Workshop 2026" value={form.title}
                  onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea name="description" className="form-control"
                  placeholder="Describe the event..." value={form.description}
                  onChange={handleChange} rows={3} required style={{ resize: "vertical" }} />
              </div>
              <div className="modal-grid-2">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select name="category" className="form-control"
                    value={form.category} onChange={handleChange}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select name="status" className="form-control"
                    value={form.status} onChange={handleChange}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input type="date" name="date" className="form-control"
                    value={form.date} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Time *</label>
                  <input type="text" name="time" className="form-control"
                    placeholder="e.g. 10:00 AM - 1:00 PM"
                    value={form.time} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Venue *</label>
                  <input type="text" name="venue" className="form-control"
                    placeholder="e.g. Seminar Hall A"
                    value={form.venue} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Capacity *</label>
                  <input type="number" name="max_capacity" className="form-control"
                    placeholder="e.g. 100" value={form.max_capacity}
                    onChange={handleChange} required min={1} />
                </div>
                <div className="form-group">
                  <label className="form-label">Budget (₹)</label>
                  <input type="number" name="budget" className="form-control"
                    placeholder="e.g. 5000" value={form.budget}
                    onChange={handleChange} min={0} />
                </div>
                <div className="form-group">
                  <label className="form-label">Organizer</label>
                  <input type="text" name="organizer" className="form-control"
                    placeholder="e.g. CS Dept."
                    value={form.organizer} onChange={handleChange} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost"
                  onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? <span className="spinner spinner-sm" /> : null}
                  {editingEvent ? "Update" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Event Card Sub-Component ────────────────────────────────── */
function OrgEventCard({
  event, onEdit, onDelete, onApprove, onReject,
  formatDate, formatBudget, approvalColor,
}) {
  const fill = event.max_capacity > 0
    ? Math.round((event.current_count / event.max_capacity) * 100) : 0;

  return (
    <div className="org-event-card animate-fade-in-up">
      {/* Top: Organizer + Approval Badge */}
      <div className="org-card-top">
        <span className="org-card-organizer">{event.organizer}</span>
        <span className={`badge badge-${approvalColor(event.approval_status)}`}>
          {event.approval_status?.toUpperCase()}
        </span>
      </div>

      {/* Title */}
      <h3 className="org-card-title">{event.title}</h3>

      {/* Meta */}
      <div className="org-card-meta">
        <span><FiCalendar size={12} /> {formatDate(event.date)}</span>
        <span><FiClock size={12} /> {event.time}</span>
        <span><FiMapPin size={12} /> {event.venue}</span>
        <span><FiDollarSign size={12} /> Budget: {formatBudget(event.budget)}</span>
      </div>

      {/* Registration + Live */}
      <div className="org-card-bottom">
        <div className="org-card-reg">
          <FiUsers size={13} />
          <span className="org-card-reg-count">
            {event.current_count} / {event.max_capacity} applied
          </span>
          {event.status === "upcoming" || event.status === "ongoing" ? (
            <span className="org-card-live">
              <span className="live-dot" /> LIVE
            </span>
          ) : null}
        </div>

        {/* Actions */}
        <div className="org-card-actions">
          {event.approval_status === "pending" && (
            <>
              <button
                className="icon-btn green"
                title="Approve"
                onClick={() => onApprove(event._id)}
              >
                <FiCheckCircle size={14} />
              </button>
              <button
                className="icon-btn red"
                title="Reject"
                onClick={() => onReject(event._id)}
              >
                <FiXCircle size={14} />
              </button>
            </>
          )}
          <button className="icon-btn blue" title="Edit" onClick={() => onEdit(event)}>
            <FiEdit2 size={14} />
          </button>
          <button className="icon-btn red" title="Delete" onClick={() => onDelete(event)}>
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className={`org-card-accent accent-${approvalColor(event.approval_status)}`} />
    </div>
  );
}
