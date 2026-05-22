import { motion } from "framer-motion";
import {
  FiCode,
  FiServer,
  FiDatabase,
  FiLock,
  FiCloud,
  FiTool,
  FiArrowRight,
  FiGlobe,
  FiHeart,
} from "react-icons/fi";
import "./TechStackPage.css";

const TECH_LAYERS = [
  {
    title: "Frontend",
    icon: <FiCode />,
    color: "var(--accent-blue)",
    colorBg: "rgba(137,180,250,0.12)",
    techs: [
      { name: "React.js", desc: "Component-based UI library for building interactive interfaces" },
      { name: "Vite", desc: "Lightning-fast build tool with HMR for modern web projects" },
      { name: "Zustand", desc: "Minimal, scalable state management with hooks" },
      { name: "Framer Motion", desc: "Production-ready animation library for React" },
      { name: "Recharts", desc: "Composable charting library for data visualization" },
      { name: "React Router", desc: "Declarative client-side routing for single-page apps" },
      { name: "react-icons", desc: "Popular icon packs as React components" },
      { name: "qrcode.react", desc: "QR code generator component for tickets" },
      { name: "react-hot-toast", desc: "Lightweight, customizable toast notifications" },
      { name: "Axios", desc: "Promise-based HTTP client for API communication" },
    ],
  },
  {
    title: "Backend",
    icon: <FiServer />,
    color: "var(--accent-green)",
    colorBg: "rgba(166,227,161,0.12)",
    techs: [
      { name: "Node.js", desc: "JavaScript runtime for server-side execution" },
      { name: "Express.js", desc: "Minimal, flexible web framework for REST APIs" },
    ],
  },
  {
    title: "Database",
    icon: <FiDatabase />,
    color: "var(--accent-mauve)",
    colorBg: "rgba(203,166,247,0.12)",
    techs: [
      { name: "MongoDB", desc: "NoSQL document database for flexible data storage" },
      { name: "Mongoose ODM", desc: "Elegant MongoDB object modeling with schema validation" },
    ],
  },
  {
    title: "Authentication",
    icon: <FiLock />,
    color: "var(--accent-yellow)",
    colorBg: "rgba(249,226,175,0.12)",
    techs: [
      { name: "JWT", desc: "JSON Web Tokens for stateless, secure authentication" },
      { name: "bcryptjs", desc: "Password hashing with salt rounds for security" },
    ],
  },
  {
    title: "Deployment",
    icon: <FiCloud />,
    color: "var(--accent-sky)",
    colorBg: "rgba(137,220,235,0.12)",
    techs: [
      { name: "Render", desc: "Cloud platform hosting both backend API and frontend static files" },
    ],
  },
  {
    title: "Dev Tools",
    icon: <FiTool />,
    color: "var(--accent-peach)",
    colorBg: "rgba(250,179,135,0.12)",
    techs: [
      { name: "Git", desc: "Distributed version control for source code management" },
      { name: "GitHub", desc: "Code hosting platform for collaboration and CI/CD" },
      { name: "VS Code", desc: "Feature-rich code editor with extensions ecosystem" },
      { name: "Postman", desc: "API testing and documentation tool" },
    ],
  },
];

const ARCH_STEPS = [
  { label: "Client", sub: "React + Vite", icon: <FiGlobe />, color: "var(--accent-blue)" },
  { label: "API Layer", sub: "Axios / REST", icon: <FiArrowRight />, color: "var(--accent-sky)" },
  { label: "Server", sub: "Express.js", icon: <FiServer />, color: "var(--accent-green)" },
  { label: "Database", sub: "MongoDB", icon: <FiDatabase />, color: "var(--accent-mauve)" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function TechStackPage() {
  return (
    <div className="tech-page page-wrapper">
      <div className="container">
        {/* Decorative orbs */}
        <div className="tech-orb tech-orb-1" />
        <div className="tech-orb tech-orb-2" />
        <div className="tech-orb tech-orb-3" />

        {/* ─── Header ──────────────────────────────────── */}
        <motion.div
          className="tech-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="tech-header-icon">
            <FiCode />
          </div>
          <div>
            <h1 className="section-title gradient-text">Tech Stack</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Technologies powering College Event Manager
            </p>
          </div>
        </motion.div>

        {/* ─── MERN Pipeline ───────────────────────────── */}
        <motion.div
          className="mern-pipeline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {["MongoDB", "Express.js", "React.js", "Node.js"].map((tech, i) => (
            <div className="mern-step" key={tech}>
              <motion.span
                className="mern-letter"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 200 }}
              >
                {tech[0]}
              </motion.span>
              <span className="mern-name">{tech}</span>
              {i < 3 && <span className="mern-divider" />}
            </div>
          ))}
        </motion.div>

        {/* ─── Architecture Diagram ────────────────────── */}
        <motion.div
          className="arch-section glass-card"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
        >
          <h3 className="arch-title">System Architecture</h3>
          <div className="arch-flow">
            {ARCH_STEPS.map((step, i) => (
              <div className="arch-step-wrapper" key={i}>
                <div className="arch-step">
                  <div className="arch-step-icon" style={{ color: step.color, background: `${step.color}15` }}>
                    {step.icon}
                  </div>
                  <span className="arch-step-label">{step.label}</span>
                  <span className="arch-step-sub">{step.sub}</span>
                </div>
                {i < ARCH_STEPS.length - 1 && (
                  <div className="arch-arrow">
                    <FiArrowRight />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ─── Tech Layer Cards ────────────────────────── */}
        <motion.div
          className="tech-grid"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {TECH_LAYERS.map((layer) => (
            <motion.div
              className="tech-card glass-card"
              key={layer.title}
              variants={card}
              whileHover={{ y: -5, boxShadow: `0 0 30px ${layer.colorBg}` }}
            >
              <div className="tech-card-header" style={{ borderBottomColor: layer.colorBg }}>
                <div className="tech-card-icon" style={{ background: layer.colorBg, color: layer.color }}>
                  {layer.icon}
                </div>
                <div>
                  <h3 className="tech-card-title" style={{ color: layer.color }}>
                    {layer.title}
                  </h3>
                  <span className="tech-card-count">
                    {layer.techs.length} {layer.techs.length === 1 ? "technology" : "technologies"}
                  </span>
                </div>
              </div>

              <div className="tech-list">
                {layer.techs.map((tech) => (
                  <div className="tech-item" key={tech.name}>
                    <span className="tech-item-name">{tech.name}</span>
                    <span className="tech-item-desc">{tech.desc}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ─── Credits ─────────────────────────────────── */}
        <motion.div
          className="tech-credits glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="credits-orb" />
          <FiHeart className="credits-heart" />
          <h3 className="credits-title">Created with passion by</h3>
          <div className="credits-names">
            <span className="credit-name">Rudra Bisht</span>
            <span className="credit-ampersand">&</span>
            <span className="credit-name">Mohit Panchal</span>
          </div>
          <p className="credits-sub">College Event Manager — MERN Full-Stack Project</p>
        </motion.div>
      </div>
    </div>
  );
}
