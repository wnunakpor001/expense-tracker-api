// controllers/authController.js
// Handles all authentication logic — registering new users and logging in existing ones.
// On success, a JWT token is returned to the frontend and stored in localStorage.

const jwt  = require("jsonwebtoken");
const User = require("../models/User");

// ── Helper: Generate JWT Token ────────────────────────────────────────────────
// Creates a signed token using the user's ID and our secret key.
// The token expires in 7 days — after that the user must log in again.
function generateToken(userId) {
  return jwt.sign(
    { id: userId },               // Payload — what we store inside the token
    process.env.JWT_SECRET,       // Secret key from .env — never hardcode this
    { expiresIn: "7d" }           // Token lifespan
  );
}

// ── REGISTER ──────────────────────────────────────────────────────────────────
// POST /auth/register
// Creates a brand new user account.
// Steps: validate input → check for duplicate email → create user → return token
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // Step 1 — Make sure all fields were provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are all required",
      });
    }

    // Step 2 — Check if someone already registered with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Step 3 — Create the user in MongoDB
    // The password is automatically hashed by the pre("save") hook in User.js
    const user = await User.create({ name, email, password });

    // Step 4 — Return the token and basic user info to the frontend
    return res.status(201).json({
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
    // Log the full error on the server for debugging
    console.error("Register error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
// POST /auth/login
// Logs in an existing user and returns a fresh token.
// Steps: validate input → find user by email → check password → return token
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Step 1 — Make sure email and password were provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Step 2 — Look up the user by email
    // If no user is found we return the same message as a wrong password
    // This prevents people from knowing which emails are registered
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Step 3 — Compare the entered password with the hashed one in the database
    // matchPassword() is defined in User.js and uses bcryptjs to compare
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Step 4 — Password is correct — return the token and user info
    return res.status(200).json({
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
    console.error("Login error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = { register, login };