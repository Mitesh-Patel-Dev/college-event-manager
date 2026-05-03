import express from "express";
import {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  checkRegistration,
} from "../controllers/registrationController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// All registration routes require authentication as a student
router.use(protect);

// Student routes
router.get("/my-events", authorizeRoles("student"), getMyRegistrations);
router.get("/check/:eventId", authorizeRoles("student"), checkRegistration);
router.post("/:eventId", authorizeRoles("student"), registerForEvent);
router.delete("/:eventId", authorizeRoles("student"), cancelRegistration);

export default router;
