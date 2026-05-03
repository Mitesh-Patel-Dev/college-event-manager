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

// Organization-only routes
router.post("/", protect, authorizeRoles("organization"), createEvent);
router.put("/:id", protect, authorizeRoles("organization"), updateEvent);
router.delete("/:id", protect, authorizeRoles("organization"), deleteEvent);

// Organization: View registrations for a specific event
router.get(
  "/:id/registrations",
  protect,
  authorizeRoles("organization"),
  getEventRegistrations
);

export default router;
