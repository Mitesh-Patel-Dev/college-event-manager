import mongoose from "mongoose";

/**
 * Registration Schema
 * ---
 * Represents a student's registration for a specific event.
 * Acts as a junction/bridge table between Users and Events.
 *
 * UNIQUE COMPOUND INDEX: { student, event }
 * Prevents a student from registering for the same event twice,
 * even if two requests arrive simultaneously (MongoDB enforces this
 * at the database level).
 */
const registrationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student reference is required"],
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event reference is required"],
    },

    registeredAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  }
);

// ─── Compound Unique Index: One registration per student per event ─
registrationSchema.index({ student: 1, event: 1 }, { unique: true });

const Registration = mongoose.model("Registration", registrationSchema);
export default Registration;
