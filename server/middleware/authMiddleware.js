/**
 * Authentication Middleware
 * Protects routes that require authentication
 */

/**
 * Check if user is authenticated
 */
const path = require("");

export const isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }
  next();
};

/**
 * Check if user is NOT authenticated (for login/register pages)
 */
export const isGuest = (req, res, next) => {
  if (req.session && req.session.userId) {
    return res.status(403).json({
      success: false,
      message: "Already authenticated",
    });
  }
  next();
};

/**
 * Optional authentication (doesn't block, but adds user info if available)
 */
export const optionalAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    req.user = {
      id: req.session.userId,
      email: req.session.userEmail,
    };
  }
  next();
};

/**
 * Check if user has specific role
 */
export const hasRole = (role) => {
  return (req, res, next) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check user role from session or database
    if (req.session.userRole !== role) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    next();
  };
};
