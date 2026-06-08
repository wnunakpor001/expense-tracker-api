const jwt  = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please log in.",
      });
    }

    const token   = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded token:", decoded);  // ← log 1

    req.user = await User.findById(decoded.id).select("-password");

    console.log("Found user:", req.user);    // ← log 2

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    next();
  } catch (error) {
    console.log("Protect error:", error.message);  // ← log 3
    return res.status(401).json({
      success: false,
      message: "Token is invalid or has expired. Please log in again.",
    });
  }
}

module.exports = protect;