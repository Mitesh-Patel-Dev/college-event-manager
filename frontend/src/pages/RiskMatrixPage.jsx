import { motion } from "framer-motion";
import { FiAlertTriangle, FiShield, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import "./RiskMatrixPage.css";

const PROBABILITY_LABELS = ["Rare", "Low", "Medium", "High", "Almost Certain"];
const IMPACT_LABELS = ["Negligible", "Minor", "Moderate", "Major", "Critical"];

/* 5×5 risk level matrix — [probability][impact] */
const RISK_LEVELS = [
  ["low", "low", "low", "medium", "medium"],
  ["low", "low", "medium", "medium", "high"],
  ["low", "medium", "medium", "high", "high"],
  ["medium", "medium", "high", "high", "critical"],
  ["medium", "high", "high", "critical", "critical"],
];

const RISK_COLORS = {
  low: { bg: "rgba(166,227,161,0.2)", border: "rgba(166,227,161,0.45)", text: "#a6e3a1", label: "Low" },
  medium: { bg: "rgba(249,226,175,0.2)", border: "rgba(249,226,175,0.45)", text: "#f9e2af", label: "Medium" },
  high: { bg: "rgba(250,179,135,0.2)", border: "rgba(250,179,135,0.45)", text: "#fab387", label: "High" },
  critical: { bg: "rgba(243,139,168,0.25)", border: "rgba(243,139,168,0.5)", text: "#f38ba8", label: "Critical" },
};

const RISKS = [
  {
    id: 1,
    name: "Low Turnout",
    probability: "Medium",
    impact: "High",
    level: "high",
    mitigation: "Early marketing campaigns, social media push, ambassador outreach, and early-bird incentives.",
    icon: <FiAlertTriangle />,
  },
  {
    id: 2,
    name: "Technical Failures",
    probability: "Low",
    impact: "High",
    level: "medium",
    mitigation: "Backup equipment on standby, full tech rehearsal 24h before, dedicated AV team.",
    icon: <FiAlertCircle />,
  },
  {
    id: 3,
    name: "Weather Disruption",
    probability: "Medium",
    impact: "Medium",
    level: "medium",
    mitigation: "Indoor backup venue reserved, weather monitoring 48h prior, attendee notification system.",
    icon: <FiAlertTriangle />,
  },
  {
    id: 4,
    name: "Budget Overrun",
    probability: "Medium",
    impact: "High",
    level: "high",
    mitigation: "15% contingency fund, weekly expense tracking, tiered sponsorship strategy.",
    icon: <FiAlertCircle />,
  },
  {
    id: 5,
    name: "Speaker Cancellation",
    probability: "Low",
    impact: "High",
    level: "medium",
    mitigation: "Maintain backup speakers list, secure written confirmations, pre-record sessions.",
    icon: <FiAlertTriangle />,
  },
  {
    id: 6,
    name: "Security Incident",
    probability: "Low",
    impact: "Critical",
    level: "critical",
    mitigation: "Professional security team, detailed emergency plan, first-aid kits, local authority liaison.",
    icon: <FiShield />,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function RiskMatrixPage() {
  return (
    <div className="risk-page page-wrapper">
      <div className="container">
        {/* Decorative orbs */}
        <div className="risk-orb risk-orb-1" />
        <div className="risk-orb risk-orb-2" />

        {/* ─── Header ───────────────────────────────────── */}
        <motion.div
          className="risk-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="risk-header-icon">
            <FiAlertTriangle />
          </div>
          <div>
            <h1 className="section-title gradient-text">Risk Matrix</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Identify, assess, and mitigate event risks
            </p>
          </div>
        </motion.div>

        {/* ─── Legend ───────────────────────────────────── */}
        <motion.div
          className="risk-legend"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {Object.entries(RISK_COLORS).map(([key, val]) => (
            <div className="legend-item" key={key}>
              <span className="legend-dot" style={{ background: val.text }} />
              <span>{val.label}</span>
            </div>
          ))}
        </motion.div>

        {/* ─── 5×5 Matrix Grid ──────────────────────────── */}
        <motion.div
          className="matrix-wrapper glass-card"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <div className="matrix-container">
            {/* Y-axis label */}
            <div className="matrix-y-label">
              <span>P R O B A B I L I T Y →</span>
            </div>

            <div className="matrix-grid-area">
              {/* Corner cell */}
              <div className="matrix-corner" />

              {/* X-axis headers (Impact) */}
              {IMPACT_LABELS.map((label) => (
                <div className="matrix-col-header" key={label}>
                  {label}
                </div>
              ))}

              {/* Rows */}
              {PROBABILITY_LABELS.slice().reverse().map((probLabel, rowIdx) => {
                const probIndex = PROBABILITY_LABELS.length - 1 - rowIdx;
                return [
                  <div className="matrix-row-header" key={`rh-${probLabel}`}>
                    {probLabel}
                  </div>,
                  ...IMPACT_LABELS.map((_, colIdx) => {
                    const level = RISK_LEVELS[probIndex][colIdx];
                    const color = RISK_COLORS[level];
                    return (
                      <motion.div
                        className="matrix-cell"
                        key={`${probIndex}-${colIdx}`}
                        style={{
                          background: color.bg,
                          borderColor: color.border,
                        }}
                        whileHover={{ scale: 1.12, zIndex: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <span style={{ color: color.text, fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase" }}>
                          {color.label}
                        </span>
                      </motion.div>
                    );
                  }),
                ];
              })}
            </div>

            {/* X-axis label */}
            <div className="matrix-x-label">
              <span>I M P A C T →</span>
            </div>
          </div>
        </motion.div>

        {/* ─── Risk Items ──────────────────────────────── */}
        <motion.div
          className="risk-items-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <h2 className="section-title" style={{ fontSize: "1.4rem" }}>
            Identified Event Risks
          </h2>
          <p className="section-subtitle">
            {RISKS.length} risks catalogued with mitigation strategies
          </p>
        </motion.div>

        <motion.div
          className="risk-items-grid"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {RISKS.map((risk) => {
            const color = RISK_COLORS[risk.level];
            return (
              <motion.div
                className="risk-item glass-card"
                key={risk.id}
                variants={item}
                whileHover={{ y: -4, boxShadow: "0 0 25px rgba(137,180,250,0.12)" }}
              >
                <div className="risk-item-top">
                  <div className="risk-item-icon" style={{ color: color.text, background: color.bg }}>
                    {risk.icon}
                  </div>
                  <div className="risk-item-info">
                    <h3 className="risk-item-name">{risk.name}</h3>
                    <div className="risk-item-tags">
                      <span className="risk-tag">
                        <FiAlertCircle size={12} /> Prob: {risk.probability}
                      </span>
                      <span className="risk-tag">
                        <FiAlertTriangle size={12} /> Impact: {risk.impact}
                      </span>
                    </div>
                  </div>
                  <span
                    className="risk-level-badge"
                    style={{ background: color.bg, color: color.text, border: `1px solid ${color.border}` }}
                  >
                    {color.label}
                  </span>
                </div>

                <div className="risk-mitigation">
                  <div className="risk-mitigation-label">
                    <FiShield size={13} /> Mitigation Strategy
                  </div>
                  <p className="risk-mitigation-text">{risk.mitigation}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ─── Summary Stats ───────────────────────────── */}
        <motion.div
          className="risk-summary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {[
            { label: "Total Risks", value: RISKS.length, color: "var(--accent-blue)" },
            { label: "Critical", value: RISKS.filter(r => r.level === "critical").length, color: "var(--accent-red)" },
            { label: "High", value: RISKS.filter(r => r.level === "high").length, color: "var(--accent-peach)" },
            { label: "Medium", value: RISKS.filter(r => r.level === "medium").length, color: "var(--accent-yellow)" },
          ].map((s) => (
            <div className="risk-stat glass-card" key={s.label}>
              <span className="risk-stat-value" style={{ color: s.color }}>{s.value}</span>
              <span className="risk-stat-label">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
