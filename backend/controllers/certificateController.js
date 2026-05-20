import Certificate from "../models/Certificate.js";
import Registration from "../models/Registration.js";
import crypto from "crypto";

// @desc    Generate certificate for an event
// @route   POST /api/certificates/:eventId/generate
// @access  Private (Student)
export const generateCertificate = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    // Verify registration and status
    const registration = await Registration.findOne({
      student: userId,
      event: eventId,
      status: "confirmed",
    }).populate("event");

    if (!registration) {
      return res.status(403).json({
        success: false,
        message: "You must be registered for this event to get a certificate",
      });
    }

    // Usually, certificates are given after the event is "completed"
    if (registration.event.status !== "completed") {
        return res.status(400).json({
            success: false,
            message: "Certificates are only available after the event is completed"
        });
    }

    // Check if certificate already exists
    let certificate = await Certificate.findOne({ student: userId, event: eventId });

    if (!certificate) {
      // Generate a unique ID (e.g., CERT-12345678)
      const uniqueId = `CERT-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
      
      certificate = await Certificate.create({
        student: userId,
        event: eventId,
        certificateId: uniqueId,
        // In a real app, generate a PDF and upload to S3/Cloudinary, then save URL
        downloadUrl: `/api/certificates/download/${uniqueId}`, 
      });
    }

    res.status(200).json({
      success: true,
      message: "Certificate generated successfully",
      certificate,
    });
  } catch (error) {
    if (error.code === 11000) {
        return res.status(400).json({
            success: false,
            message: "Certificate already exists for this event",
        });
    }
    next(error);
  }
};

// @desc    Get user's certificates
// @route   GET /api/certificates/my
// @access  Private
export const getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ student: req.user._id })
      .populate("event", "title date category")
      .sort({ issuedAt: -1 });

    res.status(200).json({
      success: true,
      count: certificates.length,
      certificates,
    });
  } catch (error) {
    next(error);
  }
};
