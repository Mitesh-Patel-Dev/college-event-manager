import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar, FiMapPin, FiClock, FiXCircle,
  FiUser, FiHash, FiBookOpen, FiGrid,
  FiBookmark, FiStar, FiAward, FiDownload, FiCheckCircle
} from "react-icons/fi";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import useAuthStore from "../store/authStore";
import useRegistrationStore from "../store/registrationStore";
import useEventStore from "../store/eventStore";
import useCertificateStore from "../store/certificateStore";

import QRTicket from "../components/QRTicket";
import FeedbackModal from "../components/FeedbackModal";
import "./StudentDashboard.css";

const TABS = [
  { id: "tickets", label: "My Tickets", icon: FiCalendar },
  { id: "saved", label: "Saved Events", icon: FiBookmark },
  { id: "recommended", label: "For You", icon: FiStar },
  { id: "certificates", label: "Certificates", icon: FiAward },
];

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { myRegistrations, fetchMyRegistrations, cancelRegistration, isLoading: regsLoading } = useRegistrationStore();
  const { savedEvents, fetchSavedEvents, recommendedEvents, fetchRecommendedEvents, toggleSaveEvent, isLoading: eventsLoading } = useEventStore();
  const { certificates, fetchMyCertificates, generateCertificate, isLoading: certsLoading } = useCertificateStore();

  const [activeTab, setActiveTab] = useState("tickets");
  const [feedbackEvent, setFeedbackEvent] = useState(null);

  useEffect(() => {
    fetchMyRegistrations();
    fetchSavedEvents();
    fetchRecommendedEvents();
    fetchMyCertificates();
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

  const handleToggleSave = async (eventId) => {
    try {
      await toggleSaveEvent(eventId);
      fetchSavedEvents(); // refresh list
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGenerateCertificate = async (eventId) => {
    try {
      await generateCertificate(eventId);
      toast.success("Certificate generated!");
      fetchMyCertificates();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const upcoming = myRegistrations.filter((r) => r.event?.status === "upcoming" || r.event?.status === "ongoing");
  const past = myRegistrations.filter((r) => r.event?.status === "completed" || r.event?.status === "cancelled");

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="page-wrapper student-dashboard">
      <div className="container">
        {/* ─── Profile Header ──────────────────────────────── */}
        <motion.div className="dashboard-header glass-card" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="profile-card">
            <div className="profile-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
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
              <span className="dash-stat-num gradient-text">{myRegistrations.length}</span>
              <span className="dash-stat-label">Events Attended</span>
            </div>
            <div className="dash-stat-card">
              <span className="dash-stat-num" style={{ color: "var(--accent-yellow)" }}>{certificates.length}</span>
              <span className="dash-stat-label">Certificates</span>
            </div>
          </div>
        </motion.div>

        {/* ─── Tabs ────────────────────────────────────────── */}
        <div className="student-tabs">
          {TABS.map(tab => (
            <button 
              key={tab.id}
              className={`student-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={16} />
              {tab.label}
              {tab.id === "tickets" && upcoming.length > 0 && <span className="tab-badge">{upcoming.length}</span>}
              {tab.id === "saved" && savedEvents.length > 0 && <span className="tab-badge">{savedEvents.length}</span>}
            </button>
          ))}
        </div>

        {/* ─── Tab Content ─────────────────────────────────── */}
        <div className="student-tab-content">
          <AnimatePresence mode="wait">
            
            {/* TICKET TAB */}
            {activeTab === "tickets" && (
              <motion.div key="tickets" variants={containerVariants} initial="hidden" animate="show" exit="hidden">
                {regsLoading ? <div className="spinner" /> : upcoming.length > 0 ? (
                  <div className="ticket-grid">
                    {upcoming.map(reg => (
                      <motion.div key={reg._id} variants={itemVariants}>
                        <QRTicket registration={reg} user={user} />
                        <div className="ticket-actions">
                           <Link to={`/events/${reg.event._id}`} className="btn btn-ghost btn-sm">View Event</Link>
                           <button className="btn btn-danger btn-sm" onClick={() => handleCancel(reg.event._id, reg.event.title)}>
                             Cancel Registration
                           </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state glass-card">
                    <FiCalendar size={48} />
                    <h3>No upcoming tickets</h3>
                    <p>You haven't registered for any upcoming events yet.</p>
                    <Link to="/events" className="btn btn-primary" style={{ marginTop: "1rem" }}>Browse Events</Link>
                  </div>
                )}

                {/* Past Events in Tickets tab */}
                {past.length > 0 && (
                  <motion.div variants={itemVariants} style={{ marginTop: "3rem" }}>
                    <h3 className="section-subtitle">Past Events</h3>
                    <div className="past-events-list">
                      {past.map(reg => (
                        <div className="past-event-item glass-card" key={reg._id}>
                          <div className="past-info">
                            <h4>{reg.event?.title}</h4>
                            <span>{formatDate(reg.event?.date)}</span>
                          </div>
                          <div className="past-actions">
                            {reg.event?.status === "completed" && (
                              <>
                                {!certificates.some(c => c.event._id === reg.event._id) && (
                                  <button className="btn btn-primary btn-sm" onClick={() => handleGenerateCertificate(reg.event._id)}>
                                    <FiAward /> Get Certificate
                                  </button>
                                )}
                                <button className="btn btn-ghost btn-sm" onClick={() => setFeedbackEvent(reg.event)}>
                                  <FiStar /> Rate Event
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* SAVED TAB */}
            {activeTab === "saved" && (
              <motion.div key="saved" variants={containerVariants} initial="hidden" animate="show" exit="hidden">
                {eventsLoading ? <div className="spinner" /> : savedEvents.length > 0 ? (
                  <div className="events-grid">
                    {savedEvents.map(event => (
                      <motion.div key={event._id} variants={itemVariants} className="event-card glass-card glow-hover">
                        <div className="event-card-content">
                          <div className="event-card-header">
                            <span className="badge badge-blue">{event.category}</span>
                            <button className="save-btn active" onClick={() => handleToggleSave(event._id)}>
                              <FiBookmark fill="currentColor" />
                            </button>
                          </div>
                          <h3 className="event-title">{event.title}</h3>
                          <div className="event-meta">
                            <span><FiCalendar /> {formatDate(event.date)}</span>
                            <span><FiMapPin /> {event.venue}</span>
                          </div>
                          <Link to={`/events/${event._id}`} className="btn btn-primary btn-full" style={{ marginTop: "1rem" }}>
                            View Details
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state glass-card">
                    <FiBookmark size={48} />
                    <h3>No saved events</h3>
                    <p>Click the bookmark icon on any event to save it for later.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* RECOMMENDED TAB */}
            {activeTab === "recommended" && (
              <motion.div key="recommended" variants={containerVariants} initial="hidden" animate="show" exit="hidden">
                {eventsLoading ? <div className="spinner" /> : recommendedEvents.length > 0 ? (
                  <div className="events-grid">
                    {recommendedEvents.map(event => (
                      <motion.div key={event._id} variants={itemVariants} className="event-card glass-card glow-hover">
                        <div className="event-card-content">
                          <div className="event-card-header">
                            <span className="badge badge-purple">Recommended</span>
                          </div>
                          <h3 className="event-title">{event.title}</h3>
                          <div className="event-meta">
                            <span><FiCalendar /> {formatDate(event.date)}</span>
                            <span><FiMapPin /> {event.venue}</span>
                          </div>
                          <Link to={`/events/${event._id}`} className="btn btn-primary btn-full" style={{ marginTop: "1rem" }}>
                            View Details
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state glass-card">
                    <FiStar size={48} />
                    <h3>No recommendations yet</h3>
                    <p>Register for more events so we can learn what you like!</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* CERTIFICATES TAB */}
            {activeTab === "certificates" && (
              <motion.div key="certificates" variants={containerVariants} initial="hidden" animate="show" exit="hidden">
                {certsLoading ? <div className="spinner" /> : certificates.length > 0 ? (
                  <div className="cert-grid">
                    {certificates.map(cert => (
                      <motion.div key={cert._id} variants={itemVariants} className="cert-card glass-card glow-hover">
                        <div className="cert-icon-bg">
                          <FiAward size={48} color="var(--accent-yellow)" />
                        </div>
                        <h4 className="cert-title">{cert.event?.title}</h4>
                        <p className="cert-id">ID: {cert.certificateId}</p>
                        <p className="cert-date">Issued: {formatDate(cert.issuedAt)}</p>
                        <button className="btn btn-primary btn-full btn-sm" style={{ marginTop: "1rem" }} onClick={() => toast.success("Download started (mock)")}>
                          <FiDownload /> Download PDF
                        </button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state glass-card">
                    <FiAward size={48} />
                    <h3>No certificates yet</h3>
                    <p>Attend completed events to earn certificates.</p>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
      
      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={!!feedbackEvent} 
        event={feedbackEvent} 
        onClose={() => setFeedbackEvent(null)} 
      />
    </div>
  );
}
