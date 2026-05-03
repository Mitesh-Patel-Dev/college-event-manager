import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

// ─────────────────────────────────────────────────────────────────────
// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
// ─────────────────────────────────────────────────────────────────────
export const createEvent = async (req, res, next) => {
  try {
    // Attach the admin user who is creating the event
    req.body.createdBy = req.user._id;

    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────
// @desc    Get all events (with optional filters)
// @route   GET /api/events
// @access  Public
// ─────────────────────────────────────────────────────────────────────
export const getAllEvents = async (req, res, next) => {
  try {
    const { category, status, search } = req.query;

    // Build dynamic filter object
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
      filter.title = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    const events = await Event.find(filter)
      .sort({ date: 1 }) // Nearest events first
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────
// @desc    Get a single event by ID
// @route   GET /api/events/:id
// @access  Public
// ─────────────────────────────────────────────────────────────────────
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────
// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
// ─────────────────────────────────────────────────────────────────────
export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Prevent manually overriding current_count through updates
    delete req.body.current_count;

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────
// @desc    Delete an event (and all associated registrations)
// @route   DELETE /api/events/:id
// @access  Private/Admin
// ─────────────────────────────────────────────────────────────────────
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Clean up: Remove all registrations linked to this event
    await Registration.deleteMany({ event: req.params.id });

    // Delete the event itself
    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Event and all associated registrations deleted",
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────
// @desc    Get all students registered for a specific event
// @route   GET /api/events/:id/registrations
// @access  Private/Admin
// ─────────────────────────────────────────────────────────────────────
export const getEventRegistrations = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const registrations = await Registration.find({
      event: req.params.id,
      status: "confirmed",
    })
      .populate("student", "name email department rollNumber")
      .sort({ registeredAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      event: { _id: event._id, title: event.title },
      registrations,
    });
  } catch (error) {
    next(error);
  }
};
