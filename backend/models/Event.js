import mongoose from "mongoose";

/**
 * Event Schema
 * ---
 * Represents a campus event created by an Admin.
 *
 * KEY DESIGN DECISION — `current_count`:
 * This field tracks how many students have registered. It is updated
 * ATOMICALLY using MongoDB's `$inc` operator in the registration controller.
 * This prevents race conditions when multiple students register simultaneously.
 *
 * The `max_capacity` field sets the upper limit. Registration is blocked
 * when `current_count >= max_capacity`.
 */
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Workshop",
        "Seminar",
        "Cultural",
        "Sports",
        "Technical",
        "Guest Lecture",
        "Hackathon",
        "Other",
      ],
    },

    date: {
      type: Date,
      required: [true, "Event date is required"],
    },

    time: {
      type: String,
      required: [true, "Event time is required"],
      trim: true,
    },

    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },

    max_capacity: {
      type: Number,
      required: [true, "Maximum capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },

    // Atomically incremented/decremented — never set manually
    current_count: {
      type: Number,
      default: 0,
      min: 0,
    },

    organizer: {
      type: String,
      trim: true,
      default: "College Administration",
    },

    budget: {
      type: Number,
      default: 0,
      min: [0, "Budget cannot be negative"],
    },

    image: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },

    approval_status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // Reference to the admin who created this event
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    // Virtual field: seats available (not stored in DB)
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtual: Calculate available seats on-the-fly ─────────────────
eventSchema.virtual("seatsAvailable").get(function () {
  return this.max_capacity - this.current_count;
});

// ─── Index for faster queries ──────────────────────────────────────
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ category: 1 });

const Event = mongoose.model("Event", eventSchema);
export default Event;
