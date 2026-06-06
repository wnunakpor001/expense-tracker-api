// models/Expense.js
// Each expense now has an "owner" field linking it to the user who created it.

const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,   // Every expense must belong to a user
    },
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
        message: "Invalid category",
      },
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Expense", expenseSchema);