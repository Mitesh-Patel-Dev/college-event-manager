import express from "express";
import { submitFeedback, getEventFeedback } from "../controllers/feedbackController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, submitFeedback);
router.get("/:eventId", getEventFeedback);

export default router;
