import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
} from "../controllers/eventController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllEvents);
router.get("/:id", getEventById);

// Admin-only routes
router.post("/", protect, authorizeRoles("admin"), createEvent);
router.put("/:id", protect, authorizeRoles("admin"), updateEvent);
router.delete("/:id", protect, authorizeRoles("admin"), deleteEvent);

// Admin: View registrations for a specific event
router.get(
  "/:id/registrations",
  protect,
  authorizeRoles("admin"),
  getEventRegistrations
);

export default router;
