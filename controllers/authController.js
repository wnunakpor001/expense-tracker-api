// controllers/authController.js
// Handles user registration and login.
// On success, returns a JWT token the frontend stores and sends with every request.

const jwt  = require("jsonwebtoken");
const User = require("../models/User");

// ── Helper: generate a JWT token ─────────────────────────────────────────────
function generateToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }   // Token expires in 7 days
  );
}

/**
 * POST /auth/register
 * Creates a new user account.
 */
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are all required",
      });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Create the user — password is hashed automatically by the User model
    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token: generateToken(user._id),
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * POST /auth/login
 * Logs in an existing user and returns a token.
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { register, login };