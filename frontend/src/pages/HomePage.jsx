import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCalendar, FiUsers, FiShield, FiZap } from "react-icons/fi";
import useEventStore from "../store/eventStore";
import EventCard from "../components/EventCard";
import "./HomePage.css";

const FEATURES = [
  {
    icon: <FiZap />,
    color: "blue",
    title: "Real-Time Availability",
    desc: "Live seat counts update instantly. Know exactly how many spots remain before you register.",
  },
  {
    icon: <FiShield />,
    color: "green",
    title: "Overbooking Prevention",
    desc: "Our atomic registration system guarantees no event goes over capacity, ever.",
  },
  {
    icon: <FiUsers />,
    color: "mauve",
    title: "Smart Dashboards",
    desc: "Students track their events; admins manage everything from one powerful control panel.",
  },
  {
    icon: <FiCalendar />,
    color: "peach",
    title: "Full Event Catalog",
    desc: "Browse workshops, hackathons, cultural events and more — all in one place.",
  },
];

export default function HomePage() {
  const { events, fetchEvents, isLoading } = useEventStore();

  useEffect(() => {
    fetchEvents({ status: "upcoming" });
  }, []);

  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="home-page">
      {/* ─── Hero Section ─────────────────────────────────────── */}
      <section className="hero-section">
        {/* Background Orbs */}
        <div className="hero-orb orb-1" />
        <div className="hero-orb orb-2" />
        <div className="hero-orb orb-3" />

        <div className="container hero-content">
          <div className="hero-badge animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="live-dot" />
            Real-Time Registration System
          </div>

          <h1 className="hero-title animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Your Campus Events,
            <br />
            <span className="gradient-text">Managed Smartly</span>
          </h1>

          <p className="hero-subtitle animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            Browse hundreds of campus events, register instantly, and track your
            schedule — all in one beautifully designed platform built for
            students.
          </p>

          <div className="hero-cta animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/events" className="btn btn-primary btn-lg" id="hero-browse-btn">
              Browse Events <FiArrowRight />
            </Link>
            <Link to="/register" className="btn btn-ghost btn-lg" id="hero-signup-btn">
              Create Account
            </Link>
          </div>

          <div className="hero-stats animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="hero-stat">
              <span className="stat-value">500+</span>
              <span className="stat-label">Events Hosted</span>
            </div>
            <div className="stat-divider" />
            <div className="hero-stat">
              <span className="stat-value">10K+</span>
              <span className="stat-label">Registrations</span>
            </div>
            <div className="stat-divider" />
            <div className="hero-stat">
              <span className="stat-value">0</span>
              <span className="stat-label">Overbookings</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Section ──────────────────────────────────── */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why College Event Manager?</h2>
            <p className="section-subtitle">
              Built with cutting-edge technology to give students the best
              registration experience
            </p>
          </div>

          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div className="feature-card animate-fade-in-up" key={i} style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                <div className={`feature-icon feature-icon-${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Upcoming Events Preview ───────────────────────────── */}
      <section className="preview-section">
        <div className="container">
          <div className="preview-header">
            <div>
              <h2 className="section-title">Upcoming Events</h2>
              <p className="section-subtitle">Register before seats fill up</p>
            </div>
            <Link to="/events" className="btn btn-ghost" id="home-view-all-btn">
              View All <FiArrowRight />
            </Link>
          </div>

          {isLoading ? (
            <div className="spinner" />
          ) : upcomingEvents.length > 0 ? (
            <div className="events-grid">
              {upcomingEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FiCalendar />
              <h3>No upcoming events yet</h3>
              <p>Check back soon — events are being added regularly!</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA Banner ────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card animate-fade-in-up">
            <div className="cta-orb animate-float" />
            <h2 className="cta-title">Ready to Join the Action?</h2>
            <p className="cta-desc">
              Sign up in seconds and start registering for events that matter to
              you.
            </p>
            <Link to="/register" className="btn btn-primary btn-lg" id="home-cta-register-btn">
              Get Started — It's Free <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
