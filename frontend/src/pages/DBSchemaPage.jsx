import { motion } from "framer-motion";
import { FiDatabase, FiLink, FiKey, FiHash, FiCalendar, FiType } from "react-icons/fi";
import "./DBSchemaPage.css";

const TYPE_ICONS = {
  ObjectId: <FiKey size={12} />,
  String: <FiType size={12} />,
  Number: <FiHash size={12} />,
  Date: <FiCalendar size={12} />,
  Boolean: <FiHash size={12} />,
  Array: <FiHash size={12} />,
  ref: <FiLink size={12} />,
};

const COLLECTIONS = [
  {
    name: "Users",
    color: "var(--accent-blue)",
    colorBg: "rgba(137,180,250,0.12)",
    fields: [
      { name: "_id", type: "ObjectId", primary: true },
      { name: "name", type: "String" },
      { name: "email", type: "String", unique: true },
      { name: "password", type: "String" },
      { name: "role", type: "String", enum: "student / organization" },
      { name: "department", type: "String" },
      { name: "rollNumber", type: "String" },
      { name: "avatar", type: "String" },
      { name: "phone", type: "String" },
      { name: "savedEvents", type: "Array", ref: "Event" },
    ],
  },
  {
    name: "Events",
    color: "var(--accent-mauve)",
    colorBg: "rgba(203,166,247,0.12)",
    fields: [
      { name: "_id", type: "ObjectId", primary: true },
      { name: "title", type: "String" },
      { name: "description", type: "String" },
      { name: "category", type: "String" },
      { name: "date", type: "Date" },
      { name: "time", type: "String" },
      { name: "venue", type: "String" },
      { name: "max_capacity", type: "Number" },
      { name: "current_count", type: "Number" },
      { name: "organizer", type: "ObjectId", ref: "User" },
      { name: "status", type: "String" },
      { name: "approval_status", type: "String" },
      { name: "budget", type: "Number" },
      { name: "tags", type: "Array" },
      { name: "createdBy", type: "ObjectId", ref: "User" },
    ],
  },
  {
    name: "Registrations",
    color: "var(--accent-green)",
    colorBg: "rgba(166,227,161,0.12)",
    fields: [
      { name: "_id", type: "ObjectId", primary: true },
      { name: "student", type: "ObjectId", ref: "User" },
      { name: "event", type: "ObjectId", ref: "Event" },
      { name: "status", type: "String", enum: "confirmed / cancelled" },
      { name: "registeredAt", type: "Date" },
    ],
  },
  {
    name: "Feedback",
    color: "var(--accent-yellow)",
    colorBg: "rgba(249,226,175,0.12)",
    fields: [
      { name: "_id", type: "ObjectId", primary: true },
      { name: "student", type: "ObjectId", ref: "User" },
      { name: "event", type: "ObjectId", ref: "Event" },
      { name: "rating", type: "Number", note: "1-5" },
      { name: "comment", type: "String" },
      { name: "createdAt", type: "Date" },
    ],
  },
  {
    name: "Certificates",
    color: "var(--accent-peach)",
    colorBg: "rgba(250,179,135,0.12)",
    fields: [
      { name: "_id", type: "ObjectId", primary: true },
      { name: "student", type: "ObjectId", ref: "User" },
      { name: "event", type: "ObjectId", ref: "Event" },
      { name: "certificateId", type: "String", unique: true },
      { name: "downloadUrl", type: "String" },
      { name: "issuedAt", type: "Date" },
    ],
  },
  {
    name: "Notifications",
    color: "var(--accent-sky)",
    colorBg: "rgba(137,220,235,0.12)",
    fields: [
      { name: "_id", type: "ObjectId", primary: true },
      { name: "user", type: "ObjectId", ref: "User" },
      { name: "title", type: "String" },
      { name: "message", type: "String" },
      { name: "type", type: "String" },
      { name: "read", type: "Boolean" },
      { name: "link", type: "String" },
      { name: "createdAt", type: "Date" },
    ],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function DBSchemaPage() {
  return (
    <div className="schema-page page-wrapper">
      <div className="container">
        {/* Decorative orbs */}
        <div className="schema-orb schema-orb-1" />
        <div className="schema-orb schema-orb-2" />

        {/* ─── Header ──────────────────────────────────── */}
        <motion.div
          className="schema-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="schema-header-icon">
            <FiDatabase />
          </div>
          <div>
            <h1 className="section-title gradient-text">DB Schema</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              MongoDB collections and data architecture
            </p>
          </div>
        </motion.div>

        {/* ─── Stats Bar ───────────────────────────────── */}
        <motion.div
          className="schema-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="schema-stat-pill glass-card">
            <FiDatabase size={14} />
            <span><strong>{COLLECTIONS.length}</strong> Collections</span>
          </div>
          <div className="schema-stat-pill glass-card">
            <FiKey size={14} />
            <span><strong>{COLLECTIONS.reduce((a, c) => a + c.fields.length, 0)}</strong> Fields</span>
          </div>
          <div className="schema-stat-pill glass-card">
            <FiLink size={14} />
            <span>
              <strong>{COLLECTIONS.reduce((a, c) => a + c.fields.filter(f => f.ref).length, 0)}</strong> References
            </span>
          </div>
        </motion.div>

        {/* ─── Collection Cards ────────────────────────── */}
        <motion.div
          className="schema-grid"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {COLLECTIONS.map((col) => (
            <motion.div
              className="schema-card glass-card"
              key={col.name}
              variants={card}
              whileHover={{ y: -5, boxShadow: `0 0 30px ${col.colorBg}` }}
            >
              {/* Card header */}
              <div className="schema-card-header" style={{ borderBottomColor: col.colorBg }}>
                <div className="schema-card-icon" style={{ background: col.colorBg, color: col.color }}>
                  <FiDatabase />
                </div>
                <div>
                  <h3 className="schema-card-name" style={{ color: col.color }}>
                    {col.name}
                  </h3>
                  <span className="schema-card-count">{col.fields.length} fields</span>
                </div>
              </div>

              {/* Fields */}
              <div className="schema-fields">
                {col.fields.map((field) => (
                  <div className="schema-field" key={field.name}>
                    <div className="schema-field-left">
                      {field.primary ? (
                        <FiKey size={12} className="field-icon field-icon-primary" />
                      ) : field.ref ? (
                        <FiLink size={12} className="field-icon field-icon-ref" />
                      ) : (
                        <span className="field-dot" />
                      )}
                      <span className="field-name">{field.name}</span>
                    </div>
                    <div className="schema-field-right">
                      {field.ref && (
                        <span className="field-ref-badge">→ {field.ref}</span>
                      )}
                      {field.enum && (
                        <span className="field-enum">{field.enum}</span>
                      )}
                      {field.unique && (
                        <span className="field-unique">unique</span>
                      )}
                      {field.note && (
                        <span className="field-enum">{field.note}</span>
                      )}
                      <span className="field-type">{field.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ─── Relationships Diagram ───────────────────── */}
        <motion.div
          className="schema-relationships glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="schema-rel-title">
            <FiLink /> Collection Relationships
          </h3>
          <div className="schema-rel-flow">
            {[
              { from: "Registrations", to: "Users", label: "student" },
              { from: "Registrations", to: "Events", label: "event" },
              { from: "Feedback", to: "Users", label: "student" },
              { from: "Feedback", to: "Events", label: "event" },
              { from: "Certificates", to: "Users", label: "student" },
              { from: "Certificates", to: "Events", label: "event" },
              { from: "Notifications", to: "Users", label: "user" },
              { from: "Events", to: "Users", label: "organizer" },
            ].map((rel, i) => (
              <div className="rel-row" key={i}>
                <span className="rel-from">{rel.from}</span>
                <span className="rel-arrow">
                  <span className="rel-label">{rel.label}</span>
                  →
                </span>
                <span className="rel-to">{rel.to}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
