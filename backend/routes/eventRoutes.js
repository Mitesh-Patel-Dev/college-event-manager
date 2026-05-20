import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
  getEventStats,
  updateApprovalStatus,
  toggleSaveEvent,
  getSavedEvents,
  getRecommendedEvents,
} from "../controllers/eventController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllEvents);

// Student: Saved and Recommended Events (must come BEFORE /:id)
router.get("/saved", protect, getSavedEvents);
router.get("/recommended", protect, getRecommendedEvents);

// Organization: Dashboard stats (must come BEFORE /:id to avoid conflict)
router.get("/stats", protect, authorizeRoles("organization"), getEventStats);

router.get("/:id", getEventById);

// Organization-only routes
router.post("/", protect, authorizeRoles("organization"), createEvent);
router.put("/:id", protect, authorizeRoles("organization"), updateEvent);
router.delete("/:id", protect, authorizeRoles("organization"), deleteEvent);

// Organization: Update approval status
router.patch(
  "/:id/approval",
  protect,
  authorizeRoles("organization"),
  updateApprovalStatus
);

// Organization: View registrations for a specific event
router.get(
  "/:id/registrations",
  protect,
  authorizeRoles("organization"),
  getEventRegistrations
);

// Student: Toggle save event
router.post("/:id/save", protect, toggleSaveEvent);

export default router;
