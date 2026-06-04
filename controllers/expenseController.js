// controllers/expenseController.js
// All CRUD logic now uses Mongoose model methods instead of the in-memory store.
// Mongoose returns Promises, so every function is async/await.

const Expense = require("../models/Expense");

/**
 * GET /expenses
 * Returns all expenses. Supports optional ?category= filter.
 */
async function getAllExpenses(req, res) {
  try {
    const filter = {};

    // If ?category=food is passed, add it to the query filter
    if (req.query.category) {
      filter.category = req.query.category.trim().toLowerCase();
    }

    const expenses = await Expense.find(filter).sort({ createdAt: -1 }); // Newest first

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

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
 * Returns a single expense by its MongoDB _id.
 */
async function getExpenseById(req, res) {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: `Expense with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json({ success: true, expense });
  } catch (error) {
    // Mongoose throws a CastError when the ID format is invalid
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid expense ID format" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * POST /expenses
 * Creates and saves a new expense to MongoDB.
 */
async function createExpense(req, res) {
  try {
    const { title, amount, category, date } = req.body;

    const expense = await Expense.create({ title, amount, category, date });

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
 * Fully replaces an existing expense. All fields required.
 */
async function updateExpense(req, res) {
  try {
    const { title, amount, category, date } = req.body;

    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { title, amount, category, date },
      { new: true, runValidators: true } // new: return updated doc; runValidators: recheck schema rules
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: `Expense with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid expense ID format" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * PATCH /expenses/:id
 * Partially updates an expense — only the provided fields are changed.
 */
async function patchExpense(req, res) {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },  // $set only updates the fields provided
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: `Expense with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid expense ID format" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * DELETE /expenses/:id
 * Deletes an expense from MongoDB and returns the deleted document.
 */
async function deleteExpense(req, res) {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: `Expense with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
      expense,
    });
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