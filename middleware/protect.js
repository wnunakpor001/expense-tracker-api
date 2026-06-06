// middleware/protect.js
// Runs before any expense route to verify the user is logged in.
// Checks the Authorization header for a valid JWT token.
// If valid, attaches the user to req.user so controllers know who is making the request.

const jwt  = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    // Token is sent in the Authorization header as: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please log in.",
      });
    }

    // Extract the token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user and attach to the request object
    req.user = await User.findById(decoded.id).select("-password"); // exclude password

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    next(); // User is authenticated — proceed to the controller
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token is invalid or has expired. Please log in again.",
    });
  }
}

module.exports = protect;