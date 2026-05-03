import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiCalendar, FiMapPin, FiUsers, FiClock,
  FiArrowLeft, FiTag, FiUser, FiCheckCircle, FiXCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";
import useEventStore from "../store/eventStore";
import useRegistrationStore from "../store/registrationStore";
import useAuthStore from "../store/authStore";
import "./EventDetailPage.css";

const CATEGORY_COLORS = {
  Workshop: "blue", Seminar: "mauve", Cultural: "peach",
  Sports: "green", Technical: "sky", "Guest Lecture": "yellow",
  Hackathon: "red", Other: "blue",
};

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentEvent, fetchEventById, isLoading } = useEventStore();
  const { registerForEvent, cancelRegistration, checkRegistration, isLoading: regLoading } = useRegistrationStore();
  const { user, token, isOrganization } = useAuthStore();

  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingReg, setCheckingReg] = useState(true);

  useEffect(() => {
    fetchEventById(id);
  }, [id]);

  useEffect(() => {
    const check = async () => {
      if (token && user?.role === "student") {
        const result = await checkRegistration(id);
        setIsRegistered(result);
      }
      setCheckingReg(false);
    };
    check();
  }, [id, token]);

  const handleRegister = async () => {
    if (!token) {
      toast.error("Please login to register for events");
      navigate("/login");
      return;
    }
    if (user?.role === "organization") {
      toast.error("Organizations cannot apply for events");
      return;
    }
    try {
      await registerForEvent(id);
      setIsRegistered(true);
      // Refresh event to show updated seat count
      fetchEventById(id);
      toast.success("Successfully applied! 🎉");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelRegistration(id);
      setIsRegistered(false);
      fetchEventById(id);
      toast.success("Application cancelled");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (isLoading || !currentEvent) {
    return (
      <div className="page-wrapper">
        <div className="spinner" />
      </div>
    );
  }

  const {
    title, description, category, date, time, venue,
    max_capacity, current_count, status, organizer, createdBy,
  } = currentEvent;

  const seatsAvailable = max_capacity - current_count;
  const fillPct = (current_count / max_capacity) * 100;
  const isFull = seatsAvailable <= 0;
  const badgeColor = CATEGORY_COLORS[category] || "blue";
  const barColor = isFull ? "red" : fillPct >= 75 ? "yellow" : "green";

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

  return (
    <div className="page-wrapper event-detail-page">
      <div className="container">
        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate(-1)} id="back-btn">
          <FiArrowLeft /> Back
        </button>

        <div className="event-detail-layout">
          {/* ─── Main Content ─────────────────────────────────── */}
          <div className="event-detail-main">
            <div className="event-detail-badges">
              <span className={`badge badge-${badgeColor}`}>
                <FiTag size={11} /> {category}
              </span>
              <span className={`badge ${status === "upcoming" ? "badge-green" : status === "cancelled" ? "badge-red" : "badge-yellow"}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>

            <h1 className="event-detail-title">{title}</h1>

            <div className="event-detail-meta-grid">
              <div className="meta-item">
                <FiCalendar className="meta-icon" />
                <div>
                  <span className="meta-label">Date</span>
                  <span className="meta-value">{formatDate(date)}</span>
                </div>
              </div>
              <div className="meta-item">
                <FiClock className="meta-icon" />
                <div>
                  <span className="meta-label">Time</span>
                  <span className="meta-value">{time}</span>
                </div>
              </div>
              <div className="meta-item">
                <FiMapPin className="meta-icon" />
                <div>
                  <span className="meta-label">Venue</span>
                  <span className="meta-value">{venue}</span>
                </div>
              </div>
              <div className="meta-item">
                <FiUser className="meta-icon" />
                <div>
                  <span className="meta-label">Organizer</span>
                  <span className="meta-value">{organizer}</span>
                </div>
              </div>
            </div>

            <div className="event-description">
              <h2 className="desc-title">About This Event</h2>
              <p>{description}</p>
            </div>
          </div>

          {/* ─── Sidebar ─────────────────────────────────────── */}
          <div className="event-detail-sidebar">
            <div className="registration-card">
              <h3 className="reg-card-title">Application</h3>

              {/* Seat Display */}
              <div className="seat-display">
                <div className="seat-numbers">
                  <span className="seat-available-num" style={{
                    color: isFull ? "var(--accent-red)" : fillPct >= 75 ? "var(--accent-yellow)" : "var(--accent-green)"
                  }}>
                    {seatsAvailable}
                  </span>
                  <span className="seat-divider-text">/ {max_capacity}</span>
                </div>
                <p className="seat-text">seats available</p>
                <div className="seat-bar" style={{ height: "8px", marginTop: "0.75rem" }}>
                  <div className={`seat-bar-fill ${barColor}`}
                    style={{ width: `${Math.min(fillPct, 100)}%` }}
                  />
                </div>
                <p className="seat-pct-text">{Math.round(fillPct)}% filled</p>
              </div>

              {/* Action Buttons */}
              {status === "cancelled" ? (
                <div className="reg-status cancelled">
                  <FiXCircle /> This event has been cancelled
                </div>
              ) : checkingReg ? (
                <div className="spinner spinner-sm" style={{ margin: "1rem auto" }} />
              ) : isRegistered ? (
                <>
                  <div className="reg-status confirmed">
                    <FiCheckCircle /> You've Applied!
                  </div>
                  <button
                    className="btn btn-danger btn-full"
                    onClick={handleCancel}
                    disabled={regLoading}
                    id="cancel-registration-btn"
                  >
                    {regLoading ? <span className="spinner spinner-sm" /> : <FiXCircle />}
                    Cancel Application
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-primary btn-full"
                  onClick={handleRegister}
                  disabled={regLoading || isFull}
                  id="register-btn"
                >
                  {regLoading ? (
                    <span className="spinner spinner-sm" />
                  ) : isFull ? (
                    <><FiXCircle /> Event Full</>
                  ) : (
                    <><FiCheckCircle /> Apply Now</>
                  )}
                </button>
              )}

              {!token && (
                <p className="login-prompt">
                  <a href="/login">Login</a> to apply for this event
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
