import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * Error Handling Middleware
 * Centralized error handling for the application
 */

// Common bot scan paths to filter
const BOT_SCAN_PATHS = [
  "/wp-admin",
  "/wp-login",
  "/wordpress",
  "/.env",
  "/admin",
  "/phpmyadmin",
  "/phpMyAdmin",
  "/.git",
  "/config.php",
  "/xmlrpc.php",
  "/wp-includes",
  "/wp-content",
  "/.well-known",
  "/cgi-bin",
  "/mysql",
  "/cpanel",
  "/plesk",
];

/**
 * Check if path is likely a bot scan
 */
const isBotScan = (path) => {
  return BOT_SCAN_PATHS.some((scanPath) =>
    path.toLowerCase().includes(scanPath.toLowerCase())
  );
};

/**
 * Not Found Handler
 */
export const notFound = (req, res, next) => {
  // Nếu request là API thì mới trả JSON 404
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
  }

  // Còn nếu là route của React -> trả về index.html
  console.log(__dirname);

  res.sendFile(
    path.join(__dirname, "../client/public/dashboard/index.html"),
    (err) => {
      if (err) {
        next(err);
      }
    }
  );
};

/**
 * Global Error Handler
 */
export const errorHandler = (err, req, res, next) => {
  // Set status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // Handle bot scans with minimal logging
  if (err.isBotScan && statusCode === 404) {
    // Simple one-line log for bot scans
    console.log(`[Bot Scan] ${req.method} ${req.originalUrl} from ${req.ip}`);

    // Return generic 404 without details
    return res.json({
      success: false,
      message: "Not Found",
    });
  }

  // Log legitimate errors for debugging
  console.error("Error:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  // Send error response
  res.json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      error: err,
    }),
  });
};

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Validation Error Handler
 */
export const validationErrorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors,
    });
  }
  next(err);
};

/**
 * Database Error Handler
 */
export const databaseErrorHandler = (err, req, res, next) => {
  if (err.code === "ER_DUP_ENTRY" || err.code === "23505") {
    return res.status(409).json({
      success: false,
      message: "Duplicate entry found",
    });
  }

  if (err.code === "ER_NO_REFERENCED_ROW" || err.code === "23503") {
    return res.status(400).json({
      success: false,
      message: "Referenced item not found",
    });
  }

  next(err);
};
