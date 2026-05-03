import express from "express";
import { registerUser, loginUser, getMe, seedOrg } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/seed-org", seedOrg);

// Protected routes
router.get("/me", protect, getMe);

export default router;
