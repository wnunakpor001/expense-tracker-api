const express  = require("express");
const router   = express.Router();

const {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  patchExpense,
  deleteExpense,
} = require("../controllers/expenseController");

const { validateFullExpense, validatePartialExpense } = require("../middleware/validateExpense");
const protect = require("../middleware/protect");

// Apply protect to ALL routes — user must be logged in
router.use(protect);

// ── Collection routes (/expenses) ───────────────────────────────────────────
router.get("/",  getAllExpenses);
router.post("/", validateFullExpense, createExpense);

// ── Item routes (/expenses/:id) ─────────────────────────────────────────────
router.get("/:id",    getExpenseById);
router.put("/:id",    validateFullExpense,    updateExpense);
router.patch("/:id",  validatePartialExpense, patchExpense);
router.delete("/:id", deleteExpense);

module.exports = router;