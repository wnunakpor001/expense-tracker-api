// controllers/authController.js
// Handles registration (with email PIN verification), login, and PIN confirmation.

const jwt        = require("jsonwebtoken");
const bcrypt     = require("bcryptjs");
const nodemailer = require("nodemailer");
const User       = require("../models/User");

// ── Temporary store for unverified registrations ──────────────────────────────
// Holds pending signups while waiting for PIN confirmation.
// Each entry expires after 10 minutes automatically.
const pendingUsers = {};

// ── Helper: Generate a 5-digit PIN ────────────────────────────────────────────
function generatePIN() {
  return Math.floor(10000 + Math.random() * 90000).toString(); // Always 5 digits
}

// ── Helper: Generate JWT Token ────────────────────────────────────────────────
function generateToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );
}

// ── Helper: Send PIN email via Gmail ─────────────────────────────────────────
async function sendPINEmail(toEmail, name, pin) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,   // Your Gmail address from .env
      pass: process.env.EMAIL_PASS,   // Your Gmail App Password from .env
    },
  });

  await transporter.sendMail({
    from:    `"ExpenseTracker" <${process.env.EMAIL_USER}>`,
    to:      toEmail,
    subject: "Your ExpenseTracker Verification PIN",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 2px solid #0d0d0d; border-radius: 12px;">
        <h2 style="font-size: 1.8rem; letter-spacing: 2px; margin-bottom: 8px;">EXPENSE<span style="color:#ff5c3a;">TRACKER</span></h2>
        <p style="color: #555; margin-bottom: 24px;">Hi <strong>${name}</strong>, here is your verification PIN:</p>
        <div style="background: #0d0d0d; color: #c8f135; font-size: 2.5rem; font-weight: 700; letter-spacing: 10px; text-align: center; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
          ${pin}
        </div>
        <p style="color: #888; font-size: 0.85rem;">This PIN expires in <strong>10 minutes</strong>. If you did not request this, ignore this email.</p>
      </div>
    `,
  });
}

// ── STEP 1: REGISTER ──────────────────────────────────────────────────────────
// POST /auth/register
// Validates input, generates a PIN, sends it to email, stores pending signup.
// Does NOT create the user yet — that happens after PIN is verified.
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // Validate all fields are present
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are all required",
      });
    }

    // Check minimum password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
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

    // Generate PIN and hash password
    const pin            = generatePIN();
    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store pending user with PIN and 10 minute expiry
    pendingUsers[email] = {
      name,
      email,
      password: hashedPassword,
      pin,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes from now
    };

    // Send the PIN to their email
    await sendPINEmail(email, name, pin);

    // Tell the frontend to show the PIN entry screen
    res.status(200).json({
      success: true,
      message: "A 5-digit PIN has been sent to your email. Please verify to complete registration.",
      email,  // Send email back so frontend knows which email to verify
    });

  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// ── STEP 2: VERIFY PIN ────────────────────────────────────────────────────────
// POST /auth/verify-pin
// Checks the PIN, creates the user account if correct.
async function verifyPin(req, res) {
  try {
    const { email, pin } = req.body;

    if (!email || !pin) {
      return res.status(400).json({
        success: false,
        message: "Email and PIN are required",
      });
    }

    // Check if there is a pending registration for this email
    const pending = pendingUsers[email];
    if (!pending) {
      return res.status(400).json({
        success: false,
        message: "No pending registration found. Please register again.",
      });
    }

    // Check if PIN has expired
    if (Date.now() > pending.expiresAt) {
      delete pendingUsers[email]; // Clean up expired entry
      return res.status(400).json({
        success: false,
        message: "PIN has expired. Please register again.",
      });
    }

    // Check if PIN matches
    if (pending.pin !== pin.trim()) {
      return res.status(400).json({
        success: false,
        message: "Incorrect PIN. Please try again.",
      });
    }

    // PIN is correct — create the user account in MongoDB
    const user = await User.create({
      name:     pending.name,
      email:    pending.email,
      password: pending.password, // Already hashed
    });

    // Clean up pending entry
    delete pendingUsers[email];

    // Return token — user is now fully registered and logged in
    return res.status(201).json({
      success: true,
      message: "Email verified! Account created successfully.",
      token: generateToken(user._id),
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Verify PIN error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// ── RESEND PIN ────────────────────────────────────────────────────────────────
// POST /auth/resend-pin
// Generates a new PIN and resends it if the user didn't receive the first one.
async function resendPin(req, res) {
  try {
    const { email } = req.body;

    const pending = pendingUsers[email];
    if (!pending) {
      return res.status(400).json({
        success: false,
        message: "No pending registration found. Please register again.",
      });
    }

    // Generate a fresh PIN and reset the 10 minute timer
    const newPin             = generatePIN();
    pending.pin              = newPin;
    pending.expiresAt        = Date.now() + 10 * 60 * 1000;
    pendingUsers[email]      = pending;

    await sendPINEmail(email, pending.name, newPin);

    res.status(200).json({
      success: true,
      message: "A new PIN has been sent to your email.",
    });

  } catch (error) {
    console.error("Resend PIN error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
// POST /auth/login
// Logs in an existing verified user.
async function login(req, res) {
  try {
    const { email, password } = req.body;

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

    // Compare entered password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

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
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { register, verifyPin, resendPin, login };