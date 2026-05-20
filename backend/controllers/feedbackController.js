import Feedback from "../models/Feedback.js";
import Event from "../models/Event.js";

// @desc    Submit event feedback
// @route   POST /api/feedback
// @access  Private
export const submitFeedback = async (req, res, next) => {
  try {
    const { eventId, rating, comment } = req.body;
    
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Create feedback
    const feedback = await Feedback.create({
      student: req.user._id,
      event: eventId,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    // Handle duplicate feedback
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted feedback for this event",
      });
    }
    next(error);
  }
};

// @desc    Get feedback for an event
// @route   GET /api/feedback/:eventId
// @access  Public
export const getEventFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find({ event: req.params.eventId })
      .populate("student", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedback.length,
      feedback,
    });
  } catch (error) {
    next(error);
  }
};
