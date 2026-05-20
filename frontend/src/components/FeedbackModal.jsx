import { useState } from "react";
import { FiStar, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import useEventStore from "../store/eventStore";
import toast from "react-hot-toast";

export default function FeedbackModal({ isOpen, onClose, event }) {
  const { submitFeedback } = useEventStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !event) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitFeedback(event._id, rating, comment);
      toast.success("Feedback submitted! Thank you.");
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div 
          className="modal glass-modal"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          style={{ maxWidth: "450px" }}
        >
          <div className="modal-header">
            <div>
              <h2 className="modal-title">Event Feedback</h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{event.title}</p>
            </div>
            <button className="modal-close" onClick={onClose}><FiX /></button>
          </div>

          <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
            <div className="form-group" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <label className="form-label" style={{ marginBottom: "0.5rem" }}>How was the event?</label>
              <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar 
                    key={star}
                    size={32}
                    style={{ 
                      cursor: "pointer", 
                      fill: star <= rating ? "var(--accent-yellow)" : "transparent",
                      color: star <= rating ? "var(--accent-yellow)" : "var(--bg-surface0)",
                      transition: "all 0.2s"
                    }}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Additional Comments (Optional)</label>
              <textarea 
                className="form-control" 
                rows={4} 
                placeholder="What did you like? What could be improved?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ resize: "vertical" }}
              />
            </div>

            <div className="modal-footer" style={{ marginTop: "1.5rem", borderTop: "none" }}>
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
