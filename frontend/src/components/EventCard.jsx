import { Link } from "react-router-dom";
import { FiCalendar, FiMapPin, FiUsers, FiClock, FiBookmark } from "react-icons/fi";
import useAuthStore from "../store/authStore";
import useEventStore from "../store/eventStore";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import "./EventCard.css";

export default function EventCard({ event }) {
  const { user } = useAuthStore();
  const { savedEvents, toggleSaveEvent, fetchSavedEvents } = useEventStore();

  const isSaved = savedEvents.some(e => e._id === event._id);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to save events");
      return;
    }
    try {
      await toggleSaveEvent(event._id);
      fetchSavedEvents();
    } catch (error) {
      toast.error("Failed to save event");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  // Popularity Prediction Logic (Trending Badge)
  const isTrending = event.max_capacity > 0 && (event.current_count / event.max_capacity) > 0.7;

  return (
    <motion.div 
      className="event-card glass-card glow-hover"
      whileHover={{ y: -5 }}
    >
      {/* Optional Image */}
      {event.image && (
        <div className="event-card-image">
          <img src={event.image} alt={event.title} />
        </div>
      )}

      <div className="event-card-content">
        <div className="event-card-header">
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <span className="badge badge-blue">{event.category}</span>
            {isTrending && <span className="badge badge-red">🔥 Trending</span>}
          </div>
          
          <button 
            className={`save-btn ${isSaved ? "active" : ""}`} 
            onClick={handleToggleSave}
            title={isSaved ? "Unsave Event" : "Save Event"}
          >
            <FiBookmark fill={isSaved ? "currentColor" : "none"} size={18} />
          </button>
        </div>

        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-desc">{event.description}</p>

        <div className="event-card-details">
          <div className="event-detail">
            <FiCalendar className="event-icon" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="event-detail">
            <FiClock className="event-icon" />
            <span>{event.time}</span>
          </div>
          <div className="event-detail">
            <FiMapPin className="event-icon" />
            <span>{event.venue}</span>
          </div>
          <div className="event-detail">
            <FiUsers className="event-icon" />
            <span>
              {event.current_count} / {event.max_capacity} Seats
            </span>
          </div>
        </div>
      </div>

      <div className="event-card-footer">
        <div className="event-organizer">
          By <span>{event.organizer}</span>
        </div>
        <Link to={`/events/${event._id}`} className="btn btn-primary btn-sm">
          View Details
        </Link>
      </div>
      
      {/* Category accent bar */}
      <div className="event-card-accent"></div>
    </motion.div>
  );
}
