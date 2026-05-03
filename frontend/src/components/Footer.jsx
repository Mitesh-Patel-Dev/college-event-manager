import { Link } from "react-router-dom";
import { FiCalendar, FiGithub, FiTwitter, FiLinkedin, FiMail } from "react-icons/fi";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="footer-logo-icon">
                <FiCalendar />
              </div>
              <span className="footer-logo-text">
                Event<span className="logo-accent">Hub</span>
              </span>
            </Link>
            <p className="footer-desc">
              Your smart campus event manager. We make discovering, registering, 
              and organizing college events completely seamless.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-icon" aria-label="Twitter">
                <FiTwitter />
              </a>
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <FiLinkedin />
              </a>
              <a href="#" className="social-icon" aria-label="GitHub">
                <FiGithub />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-group">
            <h3 className="footer-heading">Platform</h3>
            <ul className="footer-links">
              <li><Link to="/events">Browse Events</Link></li>
              <li><Link to="/register">Student Signup</Link></li>
              <li><Link to="/login">Admin Portal</Link></li>
              <li><Link to="/dashboard">My Dashboard</Link></li>
            </ul>
          </div>

          {/* Legal / Help */}
          <div className="footer-links-group">
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Guidelines</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-links-group">
            <h3 className="footer-heading">Contact Us</h3>
            <ul className="footer-links">
              <li>
                <a href="mailto:support@college.edu" className="footer-contact-link">
                  <FiMail /> support@college.edu
                </a>
              </li>
              <li>Tech Hub, Main Campus</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Smart College Event Manager. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Security</a>
            <span className="divider">·</span>
            <a href="#">Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
