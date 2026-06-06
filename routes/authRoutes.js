// routes/authRoutes.js
// Defines the two authentication endpoints.

const express = require("express");
const router  = express.Router();
const { register, login } = require("../controllers/authController");

// POST /auth/register  → create a new account
router.post("/register", register);

// POST /auth/login     → log in and receive a token
router.post("/login", login);

module.exports = router;