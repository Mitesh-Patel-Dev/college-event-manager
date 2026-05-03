import { Link } from "react-router-dom";
import { FiCalendar, FiMapPin, FiUsers, FiClock } from "react-icons/fi";
import "./EventCard.css";

/**
 * Reusable Event Card Component.
 * Displays a preview of an event with seat availability indicator.
 */
const CATEGORY_COLORS = {
  Workshop: "blue",
  Seminar: "mauve",
  Cultural: "peach",
  Sports: "green",
  Technical: "sky",
  "Guest Lecture": "yellow",
  Hackathon: "red",
  Other: "blue",
};

export default function EventCard({ event }) {
  const {
    _id,
    title,
    category,
    date,
    time,
    venue,
    max_capacity,
    current_count,
    status,
    organizer,
  } = event;

  const seatsAvailable = max_capacity - current_count;
  const fillPct = (current_count / max_capacity) * 100;
  const isFull = seatsAvailable <= 0;
  const isAlmostFull = fillPct >= 75 && !isFull;

  // Determine bar color based on fill percentage
  const barColor = isFull ? "red" : isAlmostFull ? "yellow" : "green";
  const badgeColor = CATEGORY_COLORS[category] || "blue";

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="event-card animate-fade-in-up">
      {/* Image Banner */}
      <div className="event-card-image">
        <img src="/event-placeholder.png" alt={title} />
      </div>

      {/* Category & Status */}
      <div className="event-card-top">
        <span className={`badge badge-${badgeColor}`}>{category}</span>
        {status === "cancelled" && <span className="badge badge-red">Cancelled</span>}
        {isFull && status !== "cancelled" && <span className="badge badge-red">Full</span>}
        {isAlmostFull && <span className="badge badge-yellow">Almost Full</span>}
      </div>

      {/* Title */}
      <h3 className="event-card-title">{title}</h3>

      {/* Meta Info */}
      <div className="event-card-meta">
        <span><FiCalendar size={13} /> {formatDate(date)}</span>
        <span><FiClock size={13} /> {time}</span>
        <span><FiMapPin size={13} /> {venue}</span>
      </div>

      {/* Seat Availability */}
      <div className="event-card-seats">
        <div className="seats-header">
          <span className="seats-label">
            <FiUsers size={13} />
            Seats Available
          </span>
          <span className={`seats-count ${isFull ? "full" : isAlmostFull ? "almost" : ""}`}>
            {isFull ? "Full" : `${seatsAvailable} / ${max_capacity}`}
          </span>
        </div>
        <div className="seat-bar">
          <div
            className={`seat-bar-fill ${barColor}`}
            style={{ width: `${Math.min(fillPct, 100)}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="event-card-footer">
        <span className="event-organizer">by {organizer}</span>
        <Link to={`/events/${_id}`} className="btn btn-primary btn-sm" id={`view-event-${_id}`}>
          View Details
        </Link>
      </div>
    </div>
  );
}
