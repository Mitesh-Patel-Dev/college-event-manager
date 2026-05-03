import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * protect — Authentication Middleware
 * ---
 * Verifies the JWT token from the Authorization header.
 * Attaches the decoded user object to `req.user` for downstream use.
 */
export const protect = async (req, res, next) => {
  let token;

  // Extract token from "Bearer <token>" format
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized — no token provided",
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude password)
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized — user no longer exists",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized — token is invalid or expired",
    });
  }
};

/**
 * authorizeRoles — Role-Based Authorization Middleware
 * ---
 * Restricts route access to specified roles.
 * Middleware to authorize specific roles (e.g., only organizations).
 * Usage: authorizeRoles("organization") or authorizeRoles("student", "organization")
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied — role '${req.user.role}' is not authorized`,
      });
    }
    next();
  };
};
