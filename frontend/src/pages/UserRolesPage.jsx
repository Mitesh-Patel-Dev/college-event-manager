import { motion } from "framer-motion";
import { FiUser, FiUsers, FiLock, FiUnlock, FiCheck, FiX, FiShield, FiArrowRight } from "react-icons/fi";
import "./UserRolesPage.css";

const STUDENT_CAN = [
  "Browse events",
  "Register for events",
  "Cancel registration",
  "View QR tickets",
  "Submit feedback",
  "Earn certificates",
  "Save events",
  "View recommendations",
];

const STUDENT_CANNOT = [
  "Create events",
  "Approve events",
  "View org dashboard",
  "Delete events",
];

const ORG_CAN = [
  "Create events",
  "Edit / Delete own events",
  "View registrations",
  "View analytics dashboard",
  "Generate reports",
  "Manage event status",
];

const ORG_CANNOT = [
  "Register for events",
  "Submit feedback as attendee",
];

const PERMISSIONS = [
  { feature: "Browse Events", student: true, org: true },
  { feature: "Register for Events", student: true, org: false },
  { feature: "Cancel Registration", student: true, org: false },
  { feature: "View QR Tickets", student: true, org: false },
  { feature: "Submit Feedback", student: true, org: false },
  { feature: "Earn Certificates", student: true, org: false },
  { feature: "Save Events", student: true, org: true },
  { feature: "View Recommendations", student: true, org: false },
  { feature: "Create Events", student: false, org: true },
  { feature: "Edit / Delete Events", student: false, org: true },
  { feature: "View Registrations", student: false, org: true },
  { feature: "Analytics Dashboard", student: false, org: true },
  { feature: "Generate Reports", student: false, org: true },
  { feature: "Manage Event Status", student: false, org: true },
  { feature: "Approve Events", student: false, org: false },
];

const AUTH_FLOW = [
  { label: "User Login", sub: "email + password", icon: <FiUser /> },
  { label: "Server Auth", sub: "bcrypt verify", icon: <FiLock /> },
  { label: "JWT Signed", sub: "token generated", icon: <FiShield /> },
  { label: "Client Store", sub: "localStorage", icon: <FiUnlock /> },
  { label: "API Requests", sub: "Bearer token", icon: <FiArrowRight /> },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function UserRolesPage() {
  return (
    <div className="roles-page page-wrapper">
      <div className="container">
        {/* Decorative orbs */}
        <div className="roles-orb roles-orb-1" />
        <div className="roles-orb roles-orb-2" />

        {/* ─── Header ──────────────────────────────────── */}
        <motion.div
          className="roles-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="roles-header-icon">
            <FiShield />
          </div>
          <div>
            <h1 className="section-title gradient-text">User Roles</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Role-based access control architecture
            </p>
          </div>
        </motion.div>

        {/* ─── Role Cards ──────────────────────────────── */}
        <motion.div
          className="roles-cards"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Student Card */}
          <motion.div className="role-card glass-card" variants={item}>
            <div className="role-card-header">
              <div className="role-icon role-icon-student">
                <FiUser />
              </div>
              <div>
                <h2 className="role-card-title">Student</h2>
                <span className="role-card-sub">Event attendee & participant</span>
              </div>
              <span className="badge badge-blue" style={{ marginLeft: "auto" }}>Default Role</span>
            </div>

            <div className="role-perms-section">
              <h4 className="role-perms-label role-perms-can">
                <FiCheck /> Can Do
              </h4>
              <ul className="role-perms-list">
                {STUDENT_CAN.map((p) => (
                  <li key={p} className="role-perm-item role-perm-allowed">
                    <FiCheck size={14} /> {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="role-perms-section">
              <h4 className="role-perms-label role-perms-cannot">
                <FiX /> Cannot Do
              </h4>
              <ul className="role-perms-list">
                {STUDENT_CANNOT.map((p) => (
                  <li key={p} className="role-perm-item role-perm-denied">
                    <FiX size={14} /> {p}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Organization Card */}
          <motion.div className="role-card glass-card" variants={item}>
            <div className="role-card-header">
              <div className="role-icon role-icon-org">
                <FiUsers />
              </div>
              <div>
                <h2 className="role-card-title">Organization</h2>
                <span className="role-card-sub">Event creator & manager</span>
              </div>
              <span className="badge badge-mauve" style={{ marginLeft: "auto" }}>Elevated Role</span>
            </div>

            <div className="role-perms-section">
              <h4 className="role-perms-label role-perms-can">
                <FiCheck /> Can Do
              </h4>
              <ul className="role-perms-list">
                {ORG_CAN.map((p) => (
                  <li key={p} className="role-perm-item role-perm-allowed">
                    <FiCheck size={14} /> {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="role-perms-section">
              <h4 className="role-perms-label role-perms-cannot">
                <FiX /> Cannot Do
              </h4>
              <ul className="role-perms-list">
                {ORG_CANNOT.map((p) => (
                  <li key={p} className="role-perm-item role-perm-denied">
                    <FiX size={14} /> {p}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* ─── Permissions Matrix ──────────────────────── */}
        <motion.div
          className="permissions-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="section-title" style={{ fontSize: "1.4rem", marginBottom: "0.3rem" }}>
            Permissions Matrix
          </h2>
          <p className="section-subtitle">Complete feature access comparison</p>

          <div className="table-wrapper glass-card" style={{ borderRadius: "var(--radius-lg)" }}>
            <table className="permissions-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th style={{ textAlign: "center" }}>
                    <span className="th-role"><FiUser size={13} /> Student</span>
                  </th>
                  <th style={{ textAlign: "center" }}>
                    <span className="th-role"><FiUsers size={13} /> Organization</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {PERMISSIONS.map((p) => (
                  <tr key={p.feature}>
                    <td className="perm-feature">{p.feature}</td>
                    <td style={{ textAlign: "center" }}>
                      {p.student ? (
                        <span className="perm-check"><FiCheck /></span>
                      ) : (
                        <span className="perm-cross"><FiX /></span>
                      )}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {p.org ? (
                        <span className="perm-check"><FiCheck /></span>
                      ) : (
                        <span className="perm-cross"><FiX /></span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ─── JWT Auth Flow ───────────────────────────── */}
        <motion.div
          className="auth-flow-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="section-title" style={{ fontSize: "1.4rem", marginBottom: "0.3rem" }}>
            <FiLock style={{ verticalAlign: "middle", marginRight: "0.4rem" }} />
            JWT Authentication Flow
          </h2>
          <p className="section-subtitle">Secure stateless authentication pipeline</p>

          <div className="auth-flow">
            {AUTH_FLOW.map((step, i) => (
              <div className="auth-flow-step-wrapper" key={i}>
                <motion.div
                  className="auth-flow-step glass-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  <div className="auth-step-icon">{step.icon}</div>
                  <span className="auth-step-label">{step.label}</span>
                  <span className="auth-step-sub">{step.sub}</span>
                </motion.div>
                {i < AUTH_FLOW.length - 1 && (
                  <div className="auth-flow-arrow">
                    <FiArrowRight />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
