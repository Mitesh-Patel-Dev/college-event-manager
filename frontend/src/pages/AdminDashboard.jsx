import { useEffect, useState } from "react";
import {
  FiPlus, FiEdit2, FiTrash2, FiUsers, FiCalendar,
  FiX, FiChevronDown, FiEye,
} from "react-icons/fi";
import toast from "react-hot-toast";
import useEventStore from "../store/eventStore";
import "./AdminDashboard.css";

const CATEGORIES = [
  "Workshop", "Seminar", "Cultural", "Sports",
  "Technical", "Guest Lecture", "Hackathon", "Other",
];
const STATUSES = ["upcoming", "ongoing", "completed", "cancelled"];

const EMPTY_FORM = {
  title: "", description: "", category: "Workshop", date: "",
  time: "", venue: "", max_capacity: "", organizer: "", status: "upcoming",
};

export default function AdminDashboard() {
  const { events, fetchEvents, createEvent, updateEvent, deleteEvent,
    fetchEventRegistrations, isLoading } = useEventStore();

  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [viewingRegs, setViewingRegs] = useState(null); // { event, registrations }
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchEvents(); }, []);

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
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (event) => {
    if (!window.confirm(`Delete "${event.title}"? This will also remove all registrations.`)) return;
    try {
      await deleteEvent(event._id);
      toast.success("Event deleted");
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

  const totalCapacity = events.reduce((s, e) => s + e.max_capacity, 0);
  const totalRegistrations = events.reduce((s, e) => s + e.current_count, 0);

  return (
    <div className="page-wrapper admin-dashboard">
      <div className="container">
        {/* ─── Header ──────────────────────────────────────── */}
        <div className="admin-header">
          <div>
            <h1 className="section-title">Admin Panel</h1>
            <p className="section-subtitle">Manage all campus events</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate} id="create-event-btn">
            <FiPlus /> Create Event
          </button>
        </div>

        {/* ─── Stats ───────────────────────────────────────── */}
        <div className="admin-stats">
          {[
            { label: "Total Events", value: events.length, color: "blue" },
            { label: "Total Capacity", value: totalCapacity, color: "mauve" },
            { label: "Registrations", value: totalRegistrations, color: "green" },
            {
              label: "Fill Rate",
              value: totalCapacity > 0
                ? `${Math.round((totalRegistrations / totalCapacity) * 100)}%`
                : "0%",
              color: "peach",
            },
          ].map((s) => (
            <div className={`admin-stat-card admin-stat-${s.color}`} key={s.label}>
              <span className="admin-stat-value">{s.value}</span>
              <span className="admin-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ─── Events Table ────────────────────────────────── */}
        {isLoading ? (
          <div className="spinner" />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Seats</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                      No events yet. Click "Create Event" to get started.
                    </td>
                  </tr>
                ) : (
                  events.map((event) => {
                    const fill = event.max_capacity > 0
                      ? Math.round((event.current_count / event.max_capacity) * 100)
                      : 0;
                    return (
                      <tr key={event._id}>
                        <td>
                          <div className="event-table-title">{event.title}</div>
                          <div className="event-table-venue">{event.venue}</div>
                        </td>
                        <td>{formatDate(event.date)}</td>
                        <td><span className="badge badge-blue">{event.category}</span></td>
                        <td>
                          <div className="table-seat-info">
                            <span>{event.current_count}/{event.max_capacity}</span>
                            <div className="seat-bar" style={{ width: "80px" }}>
                              <div
                                className={`seat-bar-fill ${fill >= 100 ? "red" : fill >= 75 ? "yellow" : "green"}`}
                                style={{ width: `${Math.min(fill, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge badge-${
                            event.status === "upcoming" ? "blue"
                            : event.status === "ongoing" ? "green"
                            : event.status === "completed" ? "yellow"
                            : "red"
                          }`}>
                            {event.status}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="icon-btn blue"
                              title="View Registrations"
                              onClick={() => handleViewRegistrations(event)}
                              id={`view-regs-${event._id}`}
                            >
                              <FiUsers size={15} />
                            </button>
                            <button
                              className="icon-btn mauve"
                              title="Edit Event"
                              onClick={() => openEdit(event)}
                              id={`edit-event-${event._id}`}
                            >
                              <FiEdit2 size={15} />
                            </button>
                            <button
                              className="icon-btn red"
                              title="Delete Event"
                              onClick={() => handleDelete(event)}
                              id={`delete-event-${event._id}`}
                            >
                              <FiTrash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Create/Edit Modal ────────────────────────────── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingEvent ? "Edit Event" : "Create New Event"}
              </h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
                id="modal-close-btn"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Event Title *</label>
                <input
                  name="title" className="form-control"
                  placeholder="e.g. React.js Workshop 2025"
                  value={form.title} onChange={handleChange} required
                  id="event-title-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  name="description" className="form-control"
                  placeholder="Describe the event..."
                  value={form.description} onChange={handleChange}
                  rows={3} required
                  id="event-desc-input"
                  style={{ resize: "vertical" }}
                />
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
                <div className="form-group modal-full">
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
                <h2 className="modal-title">Registrations</h2>
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
              {viewingRegs.registrations.length !== 1 ? "s" : ""} registered
            </p>

            {viewingRegs.registrations.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>
                No students registered yet.
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
