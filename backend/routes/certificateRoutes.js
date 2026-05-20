import express from "express";
import {
  generateCertificate,
  getMyCertificates,
} from "../controllers/certificateController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // All routes require auth

router.get("/my", getMyCertificates);
router.post("/:eventId/generate", generateCertificate);

export default router;
