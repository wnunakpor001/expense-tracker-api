// models/User.js
// Defines the shape of a user document in MongoDB.
// Passwords are hashed before saving — never stored as plain text.

const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,       // No two users can have the same email
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// ── Hash password before saving ───────────────────────────────────────────────
// This runs automatically every time a user is created or their password changes.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password changed
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Method to compare passwords ───────────────────────────────────────────────
// Used during login to check if the entered password matches the stored hash.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);