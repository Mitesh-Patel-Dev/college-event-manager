import { useEffect } from "react";
import { FiBell, FiCheckCircle, FiInfo, FiAlertCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import useNotificationStore from "../store/notificationStore";
import "./NotificationPanel.css";

export default function NotificationPanel({ isOpen, onClose }) {
  const { notifications, fetchNotifications, markAsRead, markAllAsRead, unreadCount } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getIcon = (type) => {
    switch (type) {
      case "success": return <FiCheckCircle className="notif-icon success" />;
      case "warning": return <FiAlertCircle className="notif-icon warning" />;
      default: return <FiInfo className="notif-icon info" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return `Yesterday`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="notification-panel glass-modal"
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <div className="notif-header">
            <h3 className="notif-title">Notifications</h3>
            {unreadCount > 0 && (
              <button className="notif-mark-all" onClick={markAllAsRead}>
                Mark all read
              </button>
            )}
          </div>
          
          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">
                <FiBell size={24} />
                <p>No new notifications</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif._id} 
                  className={`notif-item ${!notif.read ? "unread" : ""}`}
                  onClick={() => {
                    if (!notif.read) markAsRead(notif._id);
                    if (notif.link) window.location.href = notif.link;
                  }}
                >
                  <div className="notif-icon-wrap">
                    {getIcon(notif.type)}
                  </div>
                  <div className="notif-content">
                    <h4 className="notif-item-title">{notif.title}</h4>
                    <p className="notif-item-message">{notif.message}</p>
                    <span className="notif-time">{formatDate(notif.createdAt)}</span>
                  </div>
                  {!notif.read && <div className="notif-unread-dot" />}
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
