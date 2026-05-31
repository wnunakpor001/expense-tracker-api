// routes/expenseRoutes.js
// Defines all /expenses routes.
// Each route: HTTP method → validation middleware → controller function

const express = require("express");
const router = express.Router();

const {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  patchExpense,
  deleteExpense,
} = require("../controllers/expenseController");

const {
  validateFullExpense,
  validatePartialExpense,
} = require("../middleware/validateExpense");

// ── Collection routes (/expenses) ───────────────────────────────────────────

// GET  /expenses        → return all expenses (supports ?category= filter)
router.get("/", getAllExpenses);

// POST /expenses        → validate body, then create an expense
router.post("/", validateFullExpense, createExpense);

// ── Item routes (/expenses/:id) ─────────────────────────────────────────────

// GET    /expenses/:id  → return one expense
router.get("/:id", getExpenseById);

// PUT    /expenses/:id  → validate full body, then replace expense
router.put("/:id", validateFullExpense, updateExpense);

// PATCH  /expenses/:id  → validate partial body, then update expense
router.patch("/:id", validatePartialExpense, patchExpense);

// DELETE /expenses/:id  → delete expense
router.delete("/:id", deleteExpense);

module.exports = router;