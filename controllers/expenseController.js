// controllers/expenseController.js
// All operations are now scoped to req.user._id — users only see their own expenses.

const Expense = require("../models/Expense");

/**
 * GET /expenses
 * Returns only the logged-in user's expenses.
 */
async function getAllExpenses(req, res) {
  try {
    const filter = { owner: req.user._id }; // Only fetch this user's expenses

    if (req.query.category) {
      filter.category = req.query.category.trim().toLowerCase();
    }

    const expenses = await Expense.find(filter).sort({ createdAt: -1 });
    const total    = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.status(200).json({
      success: true,
      count: expenses.length,
      total: parseFloat(total.toFixed(2)),
      expenses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * GET /expenses/:id
 * Returns one expense — only if it belongs to the logged-in user.
 */
async function getExpenseById(req, res) {
  try {
    const expense = await Expense.findOne({
      _id:   req.params.id,
      owner: req.user._id,   // Ensures users can't access other people's expenses
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: `Expense not found`,
      });
    }

    res.status(200).json({ success: true, expense });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid expense ID format" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * POST /expenses
 * Creates a new expense and assigns it to the logged-in user.
 */
async function createExpense(req, res) {
  try {
    const { title, amount, category, date } = req.body;

    const expense = await Expense.create({
      owner: req.user._id,   // Automatically set from the token
      title,
      amount,
      category,
      date,
    });

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      expense,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * PUT /expenses/:id
 * Fully updates an expense — only if it belongs to the logged-in user.
 */
async function updateExpense(req, res) {
  try {
    const { title, amount, category, date } = req.body;

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { title, amount, category, date },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({ success: true, message: "Expense updated successfully", expense });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid expense ID format" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * PATCH /expenses/:id
 * Partially updates an expense — only if it belongs to the logged-in user.
 */
async function patchExpense(req, res) {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({ success: true, message: "Expense updated successfully", expense });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid expense ID format" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * DELETE /expenses/:id
 * Deletes an expense — only if it belongs to the logged-in user.
 */
async function deleteExpense(req, res) {
  try {
    const expense = await Expense.findOneAndDelete({
      _id:   req.params.id,
      owner: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({ success: true, message: "Expense deleted successfully", expense });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid expense ID format" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  patchExpense,
  deleteExpense,
};