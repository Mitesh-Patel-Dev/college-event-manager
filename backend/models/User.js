import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * User Schema
 * ---
 * Handles both Student and Admin roles via a single collection.
 * Passwords are automatically hashed before saving using bcryptjs.
 * Includes a helper method to compare passwords during login.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Never return password in queries by default
    },

    role: {
      type: String,
      enum: ["student", "organization"],
      default: "student",
    },

    department: {
      type: String,
      trim: true,
      default: "",
    },

    rollNumber: {
      type: String,
      trim: true,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    savedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ─── Pre-save Hook: Hash password before storing ───────────────────
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance Method: Compare entered password with stored hash ────
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
