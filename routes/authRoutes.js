// routes/authRoutes.js
const express = require("express");
const router  = express.Router();
const { register, verifyPin, resendPin, login } = require("../controllers/authController");

// POST /auth/register    → send PIN to email
router.post("/register",   register);

// POST /auth/verify-pin  → confirm PIN and create account
router.post("/verify-pin", verifyPin);

// POST /auth/resend-pin  → resend a fresh PIN
router.post("/resend-pin", resendPin);

// POST /auth/login       → log in existing user
router.post("/login",      login);

module.exports = router;