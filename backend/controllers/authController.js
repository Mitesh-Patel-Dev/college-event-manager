import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Generate a signed JWT token for a given user ID.
 * @param {string} id - MongoDB ObjectId of the user
 * @returns {string} Signed JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// ─────────────────────────────────────────────────────────────────────
// @desc    Register a new user (student by default)
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────────────────────────────────
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, department, rollNumber } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Create user (role defaults to 'student')
    const user = await User.create({
      name,
      email,
      password,
      department,
      rollNumber,
    });

    // Generate token and respond
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        rollNumber: user.rollNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────
// @desc    Login user (student or organization)
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────────────────────────────
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    // Find user and explicitly include password for comparison
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token and respond
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        rollNumber: user.rollNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────
// @desc    Get current logged-in user's profile
// @route   GET /api/auth/me
// @access  Private
// ─────────────────────────────────────────────────────────────────────
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        rollNumber: user.rollNumber,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────
// @desc    TEMPORARY: Seed Organization Account
// @route   GET /api/auth/seed-org
// @access  Public
// ─────────────────────────────────────────────────────────────────────
export const seedOrg = async (req, res, next) => {
  try {
    const existingOrg = await User.findOne({ role: "organization" });
    if (existingOrg) {
      return res.status(200).json({
        success: true,
        message: "Organization account already exists!",
        email: existingOrg.email
      });
    }

    const org = await User.create({
      name: "Main Organization",
      email: "org@college.edu",
      password: "orgpassword123",
      role: "organization",
    });

    res.status(201).json({
      success: true,
      message: "🎉 Organization account successfully created!",
      credentials: {
        email: org.email,
        password: "orgpassword123"
      }
    });
  } catch (error) {
    next(error);
  }
};
