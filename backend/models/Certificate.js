import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    certificateId: {
      type: String,
      required: true,
      unique: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    downloadUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

// Ensure a student can only get one certificate per event
certificateSchema.index({ student: 1, event: 1 }, { unique: true });

const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;
