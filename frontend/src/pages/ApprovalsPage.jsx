import { useEffect, useState } from "react";
import {
  FiCheckCircle, FiXCircle, FiClock, FiCalendar,
  FiMapPin, FiUsers, FiFilter, FiSearch,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import useEventStore from "../store/eventStore";
import "./ApprovalsPage.css";

const FILTERS = [
  { key: "pending", label: "Pending", color: "yellow" },
  { key: "approved", label: "Approved", color: "green" },
  { key: "rejected", label: "Rejected", color: "red" },
];

export default function ApprovalsPage() {
  const { events, fetchEvents, updateApprovalStatus, isLoading } = useEventStore();
  const [activeFilter, setActiveFilter] = useState("pending");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const filtered = events.filter((e) => {
    if (e.approval_status !== activeFilter) return false;
    if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    pending: events.filter((e) => e.approval_status === "pending").length,
    approved: events.filter((e) => e.approval_status === "approved").length,
    rejected: events.filter((e) => e.approval_status === "rejected").length,
  };

  const handleApproval = async (id, status) => {
    try {
      await updateApprovalStatus(id, status);
      toast.success(`Event ${status} successfully`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div
      className="approvals-page"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {/* ─── Header ──────────────────────────────────────── */}
      <motion.div className="approvals-header" variants={itemVariants}>
        <div>
          <h1 className="approvals-title">Event Approvals</h1>
          <p className="approvals-subtitle">Review and manage event submissions</p>
        </div>
        <div className="approvals-search">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </motion.div>

      {/* ─── Filter Tabs ─────────────────────────────────── */}
      <motion.div className="approval-filters" variants={itemVariants}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`approval-filter-btn ${activeFilter === f.key ? "active" : ""} filter-${f.color}`}
            onClick={() => setActiveFilter(f.key)}
          >
            <span className={`filter-dot dot-${f.color}`} />
            {f.label}
            <span className="filter-count">{counts[f.key]}</span>
          </button>
        ))}
      </motion.div>

      {/* ─── Approval Cards ──────────────────────────────── */}
      {isLoading ? (
        <div className="spinner" style={{ marginTop: "3rem" }} />
      ) : filtered.length > 0 ? (
        <motion.div className="approvals-grid" variants={containerVariants}>
          <AnimatePresence>
            {filtered.map((event) => (
              <motion.div
                className="approval-card glass-card"
                key={event._id}
                variants={itemVariants}
                layout
                whileHover={{ y: -4, boxShadow: "0 12px 30px -8px rgba(0,0,0,0.4)" }}
              >
                <div className="approval-card-header">
                  <span className="approval-category">{event.category}</span>
                  <span className={`badge badge-${activeFilter === "pending" ? "yellow" : activeFilter === "approved" ? "green" : "red"}`}>
                    {event.approval_status?.toUpperCase()}
                  </span>
                </div>

                <h3 className="approval-card-title">{event.title}</h3>
                <p className="approval-card-desc">{event.description}</p>

                <div className="approval-card-meta">
                  <span><FiCalendar size={13} /> {formatDate(event.date)}</span>
                  <span><FiMapPin size={13} /> {event.venue}</span>
                  <span><FiUsers size={13} /> {event.current_count}/{event.max_capacity} seats</span>
                  <span><FiClock size={13} /> {event.time}</span>
                </div>

                <div className="approval-card-organizer">
                  Submitted by: <strong>{event.organizer}</strong>
                </div>

                {/* Actions */}
                {event.approval_status === "pending" && (
                  <div className="approval-actions">
                    <button
                      className="btn btn-approve"
                      onClick={() => handleApproval(event._id, "approved")}
                    >
                      <FiCheckCircle size={16} /> Approve
                    </button>
                    <button
                      className="btn btn-reject"
                      onClick={() => handleApproval(event._id, "rejected")}
                    >
                      <FiXCircle size={16} /> Reject
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div className="empty-state glass-card" variants={itemVariants} style={{ marginTop: "2rem" }}>
          <FiFilter size={48} />
          <h3>No {activeFilter} events</h3>
          <p>There are no events with this status right now.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
