import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FiCheckSquare,
  FiSquare,
  FiCheckCircle,
  FiCircle,
  FiClipboard,
  FiSun,
  FiSend,
} from "react-icons/fi";
import "./ChecklistPage.css";

/* ─── Checklist Data ──────────────────────────────────────────── */
const INITIAL_TASKS = {
  preEvent: [
    { id: "pre-1", label: "Book venue", priority: "High", done: false },
    { id: "pre-2", label: "Send invitations", priority: "High", done: false },
    { id: "pre-3", label: "Arrange speakers", priority: "High", done: false },
    { id: "pre-4", label: "Budget approval", priority: "Medium", done: false },
    { id: "pre-5", label: "Marketing material", priority: "Medium", done: false },
    { id: "pre-6", label: "Test AV equipment", priority: "Low", done: false },
  ],
  dayOf: [
    { id: "day-1", label: "Setup venue", priority: "High", done: false },
    { id: "day-2", label: "Test microphone", priority: "High", done: false },
    { id: "day-3", label: "Registration desk", priority: "High", done: false },
    { id: "day-4", label: "Welcome signage", priority: "Medium", done: false },
    { id: "day-5", label: "Photography arranged", priority: "Medium", done: false },
    { id: "day-6", label: "Emergency contacts ready", priority: "Low", done: false },
  ],
  postEvent: [
    { id: "post-1", label: "Send thank-you emails", priority: "High", done: false },
    { id: "post-2", label: "Collect feedback", priority: "High", done: false },
    { id: "post-3", label: "Generate certificates", priority: "Medium", done: false },
    { id: "post-4", label: "Budget reconciliation", priority: "Medium", done: false },
    { id: "post-5", label: "Upload photos", priority: "Low", done: false },
    { id: "post-6", label: "Post-event report", priority: "Low", done: false },
  ],
};

const SECTIONS = [
  {
    key: "preEvent",
    title: "Pre-Event Tasks",
    subtitle: "Preparation & planning",
    icon: <FiClipboard />,
    accentColor: "blue",
  },
  {
    key: "dayOf",
    title: "Day-of Tasks",
    subtitle: "Execution & logistics",
    icon: <FiSun />,
    accentColor: "yellow",
  },
  {
    key: "postEvent",
    title: "Post-Event Tasks",
    subtitle: "Follow-up & reporting",
    icon: <FiSend />,
    accentColor: "green",
  },
];

const PRIORITY_MAP = {
  High: { className: "badge-red", label: "High" },
  Medium: { className: "badge-yellow", label: "Medium" },
  Low: { className: "badge-green", label: "Low" },
};

/* ─── Animation Variants ──────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.55, ease: "easeOut" },
  }),
};

/* ─── Component ───────────────────────────────────────────────── */
export default function ChecklistPage() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const toggleTask = (sectionKey, taskId) => {
    setTasks((prev) => ({
      ...prev,
      [sectionKey]: prev[sectionKey].map((t) =>
        t.id === taskId ? { ...t, done: !t.done } : t
      ),
    }));
  };

  /* ── Progress Calculation ── */
  const { totalTasks, completedTasks, percentage, sectionProgress } = useMemo(() => {
    let total = 0;
    let completed = 0;
    const secProg = {};

    Object.entries(tasks).forEach(([key, items]) => {
      const sTotal = items.length;
      const sDone = items.filter((t) => t.done).length;
      total += sTotal;
      completed += sDone;
      secProg[key] = { total: sTotal, done: sDone, pct: Math.round((sDone / sTotal) * 100) };
    });

    return {
      totalTasks: total,
      completedTasks: completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      sectionProgress: secProg,
    };
  }, [tasks]);

  return (
    <div className="checklist-page page-wrapper">
      <div className="container">
        {/* ── Decorative Orbs ── */}
        <div className="cl-orb cl-orb-1" />
        <div className="cl-orb cl-orb-2" />

        {/* ── Header ── */}
        <motion.div
          className="cl-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="cl-header-text">
            <h1 className="section-title">
              <FiCheckSquare className="cl-header-icon" />
              Event Checklist
            </h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Pre-event, day-of, and post-event task management
            </p>
          </div>

          <div className="cl-header-stats">
            <span className="cl-stat-completed">
              <FiCheckCircle /> {completedTasks} / {totalTasks} completed
            </span>
          </div>
        </motion.div>

        {/* ── Overall Progress Bar ── */}
        <motion.div
          className="cl-progress-wrapper glass-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="cl-progress-top">
            <span className="cl-progress-label">Overall Progress</span>
            <span className="cl-progress-value">{percentage}%</span>
          </div>
          <div className="cl-progress-bar">
            <motion.div
              className={`cl-progress-fill ${
                percentage === 100 ? "complete" : percentage >= 50 ? "mid" : ""
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="cl-progress-sections">
            {SECTIONS.map((sec) => {
              const sp = sectionProgress[sec.key] || { done: 0, total: 0, pct: 0 };
              return (
                <div className="cl-progress-sec-item" key={sec.key}>
                  <span className={`cl-sec-dot cl-sec-dot-${sec.accentColor}`} />
                  <span className="cl-sec-name">{sec.title}</span>
                  <span className="cl-sec-pct">{sp.pct}%</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Three-Column Checklist ── */}
        <div className="cl-columns">
          {SECTIONS.map((section, sIdx) => (
            <motion.div
              className={`cl-column glass-card cl-column-${section.accentColor}`}
              key={section.key}
              custom={sIdx}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              {/* Column Header */}
              <div className="cl-col-header">
                <div className={`cl-col-icon cl-col-icon-${section.accentColor}`}>
                  {section.icon}
                </div>
                <div>
                  <h2 className="cl-col-title">{section.title}</h2>
                  <p className="cl-col-subtitle">{section.subtitle}</p>
                </div>
                <span className={`cl-col-count badge badge-${section.accentColor === "yellow" ? "yellow" : section.accentColor}`}>
                  {sectionProgress[section.key]?.done ?? 0} / {sectionProgress[section.key]?.total ?? 0}
                </span>
              </div>

              {/* Section mini progress */}
              <div className="cl-col-progress-bar">
                <motion.div
                  className={`cl-col-progress-fill cl-col-fill-${section.accentColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${sectionProgress[section.key]?.pct ?? 0}%` }}
                  transition={{ duration: 0.6, delay: 0.3 + sIdx * 0.15 }}
                />
              </div>

              {/* Task List */}
              <motion.ul
                className="cl-task-list"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {tasks[section.key].map((task) => (
                  <motion.li
                    className={`cl-task-item ${task.done ? "cl-task-done" : ""}`}
                    key={task.id}
                    variants={itemVariants}
                    whileHover={{ x: 4 }}
                    onClick={() => toggleTask(section.key, task.id)}
                  >
                    <span className="cl-task-check">
                      {task.done ? (
                        <FiCheckSquare className="cl-check-icon cl-check-active" />
                      ) : (
                        <FiSquare className="cl-check-icon" />
                      )}
                    </span>
                    <span className="cl-task-label">{task.label}</span>
                    <span className={`badge ${PRIORITY_MAP[task.priority].className} cl-priority-badge`}>
                      {PRIORITY_MAP[task.priority].label}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </div>

        {/* ── Completion Banner ── */}
        {percentage === 100 && (
          <motion.div
            className="cl-complete-banner glass-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FiCheckCircle className="cl-complete-icon" />
            <div>
              <h3 className="cl-complete-title">All Tasks Completed!</h3>
              <p className="cl-complete-desc">
                Your event planning checklist is 100% complete. You're ready to go!
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
