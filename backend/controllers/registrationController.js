import mongoose from "mongoose";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

// ─────────────────────────────────────────────────────────────────────
// @desc    Register the current student for an event
// @route   POST /api/registrations/:eventId
// @access  Private/Student
//
// ⚡ CONCURRENCY STRATEGY — Atomic findOneAndUpdate
// ─────────────────────────────────────────────────────────────────────
// The biggest risk in an event registration system is OVERBOOKING.
// If 100 students click "Register" at the same millisecond for an
// event with 1 seat left, a naive read-then-write approach would let
// all 100 through because they all read current_count < max_capacity
// before any of them increment it.
//
// Our solution uses TWO layers of protection:
//
// 1. ATOMIC UPDATE via `findOneAndUpdate` with a filter condition:
//    { current_count: { $lt: max_capacity } }
//    MongoDB executes this as a single atomic operation. Only ONE
//    document will match and be updated. All other concurrent requests
//    will get `null` back, meaning the seat was already taken.
//
//    We use `$expr` to compare two fields within the same document,
//    which is the correct way to compare `current_count` against
//    `max_capacity` in a query filter.
//
// 2. UNIQUE COMPOUND INDEX on Registration { student, event }:
//    Even if the atomic update somehow allows a duplicate (it won't),
//    MongoDB will reject the duplicate Registration document at the
//    database level, throwing a duplicate key error (code 11000).
//
// This approach is lock-free, performant, and scales horizontally.
// ─────────────────────────────────────────────────────────────────────
export const registerForEvent = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { eventId } = req.params;
    const studentId = req.user._id;

    // ── Step 1: Check if student is already registered ──────────────
    const existingRegistration = await Registration.findOne({
      student: studentId,
      event: eventId,
      status: "confirmed",
    }).session(session);

    if (existingRegistration) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "You are already registered for this event",
      });
    }

    // ── Step 2: Atomically check capacity AND increment count ──────
    // This is the critical line. `$expr` lets us compare two fields
    // in the same document. `$inc` atomically increments the count.
    // If current_count >= max_capacity, `updatedEvent` will be null.
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: eventId,
        status: { $ne: "cancelled" },
        // Compare current_count < max_capacity within the document
        $expr: { $lt: ["$current_count", "$max_capacity"] },
      },
      {
        $inc: { current_count: 1 }, // Atomic increment
      },
      {
        new: true, // Return the updated document
        session,
      }
    );

    // If null, either event doesn't exist, is cancelled, or is full
    if (!updatedEvent) {
      await session.abortTransaction();
      session.endSession();

      // Determine the specific reason for failure
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }
      if (event.status === "cancelled") {
        return res.status(400).json({
          success: false,
          message: "This event has been cancelled",
        });
      }
      return res.status(400).json({
        success: false,
        message: "Sorry, this event is fully booked — no seats available",
      });
    }

    // ── Step 3: Create the registration record ─────────────────────
    const registration = await Registration.create(
      [
        {
          student: studentId,
          event: eventId,
        },
      ],
      { session }
    );

    // ── Step 4: Commit the transaction ─────────────────────────────
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: `Successfully registered for "${updatedEvent.title}"`,
      registration: registration[0],
      event: {
        _id: updatedEvent._id,
        title: updatedEvent.title,
        seatsAvailable: updatedEvent.max_capacity - updatedEvent.current_count,
      },
    });
  } catch (error) {
    // Rollback on any error
    await session.abortTransaction();
    session.endSession();

    // Handle duplicate registration (compound index violation)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this event",
      });
    }

    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────
// @desc    Cancel a student's registration for an event
// @route   DELETE /api/registrations/:eventId
// @access  Private/Student
// ─────────────────────────────────────────────────────────────────────
export const cancelRegistration = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { eventId } = req.params;
    const studentId = req.user._id;

    // Find and remove the registration
    const registration = await Registration.findOneAndUpdate(
      {
        student: studentId,
        event: eventId,
        status: "confirmed",
      },
      { status: "cancelled" },
      { new: true, session }
    );

    if (!registration) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "No active registration found for this event",
      });
    }

    // Atomically decrement the event's current_count
    await Event.findByIdAndUpdate(
      eventId,
      { $inc: { current_count: -1 } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Registration cancelled successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────
// @desc    Get all events the current student is registered for
// @route   GET /api/registrations/my-events
// @access  Private/Student
// ─────────────────────────────────────────────────────────────────────
export const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({
      student: req.user._id,
      status: "confirmed",
    })
      .populate({
        path: "event",
        select:
          "title description category date time venue max_capacity current_count status organizer image",
      })
      .sort({ registeredAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────
// @desc    Check if a student is registered for a specific event
// @route   GET /api/registrations/check/:eventId
// @access  Private/Student
// ─────────────────────────────────────────────────────────────────────
export const checkRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findOne({
      student: req.user._id,
      event: req.params.eventId,
      status: "confirmed",
    });

    res.status(200).json({
      success: true,
      isRegistered: !!registration,
    });
  } catch (error) {
    next(error);
  }
};
