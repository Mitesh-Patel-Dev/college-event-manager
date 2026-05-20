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
} from "../controllers/eventController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllEvents);

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

export default router;
