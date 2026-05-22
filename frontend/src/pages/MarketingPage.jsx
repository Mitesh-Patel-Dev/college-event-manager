import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiInstagram,
  FiMail,
  FiImage,
  FiUsers,
  FiMessageSquare,
  FiGlobe,
  FiCheckCircle,
  FiClock,
  FiTarget,
  FiCircle,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import "./MarketingPage.css";

/* ─── Demo Data ───────────────────────────────────────────────── */
const CHANNELS = [
  {
    id: "social",
    name: "Social Media",
    description: "Instagram, Twitter/X, LinkedIn posts",
    icon: <FiInstagram />,
    accentColor: "mauve",
    status: "Active",
    metrics: [
      { label: "Total Reach", value: "12.4K" },
      { label: "Impressions", value: "28.7K" },
      { label: "Engagement Rate", value: "4.8%" },
    ],
  },
  {
    id: "email",
    name: "Email Campaigns",
    description: "Newsletter, targeted emails",
    icon: <FiMail />,
    accentColor: "blue",
    status: "Active",
    metrics: [
      { label: "Open Rate", value: "42.3%" },
      { label: "Click Rate", value: "8.6%" },
      { label: "Subscribers", value: "3,250" },
    ],
  },
  {
    id: "posters",
    name: "Posters & Banners",
    description: "Physical marketing on campus",
    icon: <FiImage />,
    accentColor: "peach",
    status: "In Progress",
    metrics: [
      { label: "Locations", value: "48" },
      { label: "Designs Created", value: "12" },
      { label: "Est. Views", value: "5.2K" },
    ],
  },
  {
    id: "wom",
    name: "Word of Mouth",
    description: "Ambassador program & referrals",
    icon: <FiUsers />,
    accentColor: "green",
    status: "Active",
    metrics: [
      { label: "Referral Count", value: "387" },
      { label: "Ambassadors", value: "24" },
      { label: "Conversion", value: "32%" },
    ],
  },
  {
    id: "whatsapp",
    name: "WhatsApp Groups",
    description: "Direct messaging channels",
    icon: <FiMessageSquare />,
    accentColor: "green",
    status: "Active",
    metrics: [
      { label: "Groups Reached", value: "56" },
      { label: "Messages Sent", value: "142" },
      { label: "Response Rate", value: "78%" },
    ],
  },
  {
    id: "website",
    name: "College Website",
    description: "Featured events section",
    icon: <FiGlobe />,
    accentColor: "sky",
    status: "Scheduled",
    metrics: [
      { label: "Page Views", value: "8,340" },
      { label: "Avg. Time", value: "2m 15s" },
      { label: "Bounce Rate", value: "24%" },
    ],
  },
];

const CHART_DATA = [
  { name: "Social Media", reach: 12400, fill: "#cba6f7" },
  { name: "Email", reach: 9750, fill: "#89b4fa" },
  { name: "Posters", reach: 5200, fill: "#fab387" },
  { name: "Word of Mouth", reach: 3870, fill: "#a6e3a1" },
  { name: "WhatsApp", reach: 4480, fill: "#a6e3a1" },
  { name: "Website", reach: 8340, fill: "#89dceb" },
];

const TIMELINE = [
  {
    date: "4 Weeks Before",
    title: "Campaign Launch",
    description: "Create social media pages & start teaser posts",
    status: "completed",
  },
  {
    date: "3 Weeks Before",
    title: "Email Blast #1",
    description: "Send save-the-date newsletter to all subscribers",
    status: "completed",
  },
  {
    date: "2 Weeks Before",
    title: "Poster Distribution",
    description: "Print & distribute posters across all campus buildings",
    status: "completed",
  },
  {
    date: "1 Week Before",
    title: "Ambassador Push",
    description: "Activate word-of-mouth ambassadors & WhatsApp blasts",
    status: "in-progress",
  },
  {
    date: "3 Days Before",
    title: "Final Reminder",
    description: "Last-chance email & social media countdown posts",
    status: "upcoming",
  },
  {
    date: "Event Day",
    title: "Live Coverage",
    description: "Real-time social media updates, stories & live tweets",
    status: "upcoming",
  },
];

const STATUS_MAP = {
  Active: { className: "mkt-status-active", label: "Active" },
  "In Progress": { className: "mkt-status-progress", label: "In Progress" },
  Scheduled: { className: "mkt-status-scheduled", label: "Scheduled" },
};

/* ─── Chart Tooltip ───────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="mkt-chart-tooltip">
        <p className="mkt-tooltip-label">{label}</p>
        <p className="mkt-tooltip-value">
          Reach: <strong>{payload[0].value.toLocaleString()}</strong>
        </p>
      </div>
    );
  }
  return null;
};

/* ─── Animation Variants ──────────────────────────────────────── */
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

/* ─── Summary Stats ───────────────────────────────────────────── */
const SUMMARY_STATS = [
  {
    label: "Total Reach",
    value: "44.0K",
    icon: <FiTrendingUp />,
    color: "blue",
  },
  {
    label: "Active Channels",
    value: "6",
    icon: <FiTarget />,
    color: "green",
  },
  {
    label: "Avg Engagement",
    value: "4.8%",
    icon: <FiUsers />,
    color: "mauve",
  },
  {
    label: "Days to Event",
    value: "5",
    icon: <FiClock />,
    color: "peach",
  },
];

/* ─── Component ───────────────────────────────────────────────── */
export default function MarketingPage() {
  return (
    <div className="marketing-page page-wrapper">
      <div className="container">
        {/* ── Decorative Orbs ── */}
        <div className="mkt-orb mkt-orb-1" />
        <div className="mkt-orb mkt-orb-2" />
        <div className="mkt-orb mkt-orb-3" />

        {/* ── Header ── */}
        <motion.div
          className="mkt-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="section-title">
              <FiTrendingUp className="mkt-header-icon" />
              Marketing
            </h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Event promotion channels and campaign tracking
            </p>
          </div>
        </motion.div>

        {/* ── Summary Stats ── */}
        <div className="mkt-summary-grid">
          {SUMMARY_STATS.map((stat, i) => (
            <motion.div
              className="mkt-summary-card glass-card"
              key={stat.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <div className={`mkt-summary-icon mkt-summary-icon-${stat.color}`}>
                {stat.icon}
              </div>
              <div className="mkt-summary-info">
                <span className="mkt-summary-value">{stat.value}</span>
                <span className="mkt-summary-label">{stat.label}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Channel Cards Grid ── */}
        <div className="mkt-channels-grid">
          {CHANNELS.map((channel, i) => (
            <motion.div
              className={`mkt-channel-card glass-card glow-hover`}
              key={channel.id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              {/* Top row: icon, name, status */}
              <div className="mkt-channel-top">
                <div className={`mkt-channel-icon mkt-icon-${channel.accentColor}`}>
                  {channel.icon}
                </div>
                <div className="mkt-channel-info">
                  <h3 className="mkt-channel-name">{channel.name}</h3>
                  <p className="mkt-channel-desc">{channel.description}</p>
                </div>
                <span className={`mkt-status ${STATUS_MAP[channel.status].className}`}>
                  <span className="mkt-status-dot" />
                  {STATUS_MAP[channel.status].label}
                </span>
              </div>

              {/* Metrics */}
              <div className="mkt-metrics">
                {channel.metrics.map((metric) => (
                  <div className="mkt-metric-item" key={metric.label}>
                    <span className="mkt-metric-value">{metric.value}</span>
                    <span className="mkt-metric-label">{metric.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Reach Chart ── */}
        <motion.div
          className="mkt-chart-section glass-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.55 }}
        >
          <div className="mkt-chart-header">
            <div>
              <h2 className="mkt-section-title">Channel Reach Overview</h2>
              <p className="mkt-section-subtitle">
                Comparative reach across all marketing channels
              </p>
            </div>
            <span className="badge badge-blue">
              <FiTrendingUp /> Live Data
            </span>
          </div>

          <div className="mkt-chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={CHART_DATA} barCategoryGap="25%">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(69, 71, 90, 0.4)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#7f849c", fontSize: 12, fontFamily: "Inter" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#7f849c", fontSize: 12, fontFamily: "Inter" }}
                  tickFormatter={(v) =>
                    v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v
                  }
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(137, 180, 250, 0.06)" }} />
                <Bar dataKey="reach" radius={[6, 6, 0, 0]}>
                  {CHART_DATA.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ── Campaign Timeline ── */}
        <motion.div
          className="mkt-timeline-section glass-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.55 }}
        >
          <div className="mkt-chart-header">
            <div>
              <h2 className="mkt-section-title">Campaign Timeline</h2>
              <p className="mkt-section-subtitle">
                Marketing milestones leading up to the event
              </p>
            </div>
          </div>

          <motion.div
            className="mkt-timeline"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {TIMELINE.map((item, i) => (
              <motion.div
                className={`mkt-timeline-item mkt-tl-${item.status}`}
                key={i}
                variants={itemVariants}
              >
                <div className="mkt-tl-marker">
                  <div className={`mkt-tl-dot mkt-tl-dot-${item.status}`}>
                    {item.status === "completed" ? (
                      <FiCheckCircle />
                    ) : item.status === "in-progress" ? (
                      <FiClock />
                    ) : (
                      <FiCircle />
                    )}
                  </div>
                  {i < TIMELINE.length - 1 && <div className="mkt-tl-line" />}
                </div>
                <div className="mkt-tl-content">
                  <span className="mkt-tl-date">{item.date}</span>
                  <h4 className="mkt-tl-title">{item.title}</h4>
                  <p className="mkt-tl-desc">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
