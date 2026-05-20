import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

// ─────────────────────────────────────────────────────────────────────
// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Organization
// ─────────────────────────────────────────────────────────────────────
export const createEvent = async (req, res, next) => {
  try {
    // Attach the organization user who is creating the event
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
// @access  Private/Organization
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
// @access  Private/Organization
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
// @access  Private/Organization
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

// ─────────────────────────────────────────────────────────────────────
// @desc    Get aggregate stats for the Organization dashboard
// @route   GET /api/events/stats
// @access  Private/Organization
// ─────────────────────────────────────────────────────────────────────
export const getEventStats = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1 });

    const activeEvents = events.filter(
      (e) => e.status === "upcoming" || e.status === "ongoing"
    );
    const totalApplicants = events.reduce((s, e) => s + e.current_count, 0);
    const pendingApprovals = events.filter(
      (e) => e.approval_status === "pending"
    ).length;
    const totalCapacity = events.reduce((s, e) => s + e.max_capacity, 0);

    // Registration trend: count registrations per day over the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trendData = await Registration.aggregate([
      {
        $match: {
          registeredAt: { $gte: thirtyDaysAgo },
          status: "confirmed",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$registeredAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Active events list for sidebar
    const activeEventsList = activeEvents.slice(0, 8).map((e) => ({
      _id: e._id,
      title: e.title,
      date: e.date,
      venue: e.venue,
      approval_status: e.approval_status,
    }));

    res.status(200).json({
      success: true,
      stats: {
        activeEvents: activeEvents.length,
        totalApplicants,
        pendingApprovals,
        totalCapacity,
        fillRate:
          totalCapacity > 0
            ? Math.round((totalApplicants / totalCapacity) * 100)
            : 0,
      },
      trendData,
      activeEventsList,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────
// @desc    Update event approval status
// @route   PATCH /api/events/:id/approval
// @access  Private/Organization
// ─────────────────────────────────────────────────────────────────────
export const updateApprovalStatus = async (req, res, next) => {
  try {
    const { approval_status } = req.body;

    if (!["pending", "approved", "rejected"].includes(approval_status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid approval status. Must be: pending, approved, or rejected",
      });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { approval_status },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Event ${approval_status} successfully`,
      event,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────
// @desc    Toggle save/unsave an event for a student
// @route   POST /api/events/:id/save
// @access  Private (Student)
// ─────────────────────────────────────────────────────────────────────
export const toggleSaveEvent = async (req, res, next) => {
  try {
    const user = await req.user.model("User").findById(req.user._id);
    const eventId = req.params.id;

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isSaved = user.savedEvents.includes(eventId);

    if (isSaved) {
      user.savedEvents = user.savedEvents.filter((id) => id.toString() !== eventId);
    } else {
      user.savedEvents.push(eventId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: isSaved ? "Event unsaved" : "Event saved",
      savedEvents: user.savedEvents,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────
// @desc    Get user's saved events
// @route   GET /api/events/saved
// @access  Private (Student)
// ─────────────────────────────────────────────────────────────────────
export const getSavedEvents = async (req, res, next) => {
  try {
    const user = await req.user.model("User").findById(req.user._id).populate("savedEvents");
    
    res.status(200).json({
      success: true,
      count: user.savedEvents.length,
      events: user.savedEvents,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────
// @desc    Get recommended events for a user based on their history
// @route   GET /api/events/recommended
// @access  Private (Student)
// ─────────────────────────────────────────────────────────────────────
export const getRecommendedEvents = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Get user's past registrations to find their favorite categories
    const registrations = await req.user.model("Registration").find({ student: userId }).populate("event");
    const userCategories = new Set();
    const registeredEventIds = new Set();

    registrations.forEach((reg) => {
      if (reg.event && reg.event.category) {
        userCategories.add(reg.event.category);
        registeredEventIds.add(reg.event._id.toString());
      }
    });

    // 2. Find upcoming approved events in those categories that the user hasn't registered for
    const query = {
      status: "upcoming",
      approval_status: "approved",
      _id: { $nin: Array.from(registeredEventIds) },
    };

    if (userCategories.size > 0) {
      query.category = { $in: Array.from(userCategories) };
    }

    const recommendedEvents = await req.user.model("Event").find(query)
      .sort({ date: 1 })
      .limit(6);

    res.status(200).json({
      success: true,
      events: recommendedEvents,
    });
  } catch (error) {
    next(error);
  }
};

