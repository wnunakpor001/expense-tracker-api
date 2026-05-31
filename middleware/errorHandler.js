// middleware/errorHandler.js
// A global error-handling middleware.
// Express recognizes it as an error handler because it takes 4 arguments (err, req, res, next).
// Any error passed to next(err) anywhere in the app lands here.

function errorHandler(err, req, res, next) {
  console.error("Unhandled error:", err.message);

  // Handle malformed JSON in request body
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON in request body",
    });
  }

  // Generic server error fallback
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
    error: err.message,
  });
}

module.exports = errorHandler;