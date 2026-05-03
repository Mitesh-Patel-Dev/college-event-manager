import { useEffect, useState } from "react";
import { FiSearch, FiFilter, FiCalendar } from "react-icons/fi";
import useEventStore from "../store/eventStore";
import EventCard from "../components/EventCard";
import "./EventsPage.css";

const CATEGORIES = [
  "All", "Workshop", "Seminar", "Cultural", "Sports",
  "Technical", "Guest Lecture", "Hackathon", "Other",
];
const STATUSES = ["All", "upcoming", "ongoing", "completed"];

export default function EventsPage() {
  const { events, fetchEvents, isLoading } = useEventStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    const filters = {};
    if (category !== "All") filters.category = category;
    if (status !== "All") filters.status = status;
    if (search) filters.search = search;
    fetchEvents(filters);
  }, [category, status]);

  // Local search filter (debounced feel via useEffect)
  useEffect(() => {
    const t = setTimeout(() => {
      const filters = {};
      if (category !== "All") filters.category = category;
      if (status !== "All") filters.status = status;
      if (search) filters.search = search;
      fetchEvents(filters);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="page-wrapper events-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1 className="section-title">Event Catalog</h1>
          <p className="section-subtitle">
            Discover and register for upcoming campus events
          </p>
        </div>

        {/* Search & Filters */}
        <div className="events-controls">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
              id="event-search"
            />
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <FiFilter size={14} />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="filter-select"
                id="category-filter"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="filter-select"
                id="status-filter"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {!isLoading && (
          <p className="results-count">
            Showing <strong>{events.length}</strong> event{events.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Events Grid */}
        {isLoading ? (
          <div className="spinner" style={{ marginTop: "4rem" }} />
        ) : events.length > 0 ? (
          <div className="events-grid">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FiCalendar size={56} />
            <h3>No events found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
