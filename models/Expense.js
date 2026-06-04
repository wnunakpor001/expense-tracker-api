// models/Expense.js
// Defines the shape of an expense document in MongoDB using Mongoose.
// This replaces the old expenseStore.js — Mongoose handles all data operations now.

const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],  
      lowercase: true,
      trim: true, 
      enum: {
        values: ["food", "transport", "utilities", "health", "education", "entertainment", "shopping", "other"],
        message: "Invalid category. Must be one of: food, transport, utilities, health, education, entertainment, shopping, other",
      },
    },
    date: { 
      type: String,
      required: [true, "Date is required"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Expense", expenseSchema);