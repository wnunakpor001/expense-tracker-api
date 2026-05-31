// controllers/expenseController.js
// Contains the logic for each route.
// Controllers read from the request, call the data store, and send the response.

const store = require("../data/expenseStore");

/**
 * GET /expenses
 * Returns all expenses.
 * Supports optional query param: ?category=food to filter by category.
 */
function getAllExpenses(req, res) {
  let expenses = store.getAllExpenses();

  // Optional filtering by category via query string e.g. GET /expenses?category=food
  
  const { category } = req.query;
  if (category) {
    expenses = expenses.filter(
      (e) => e.category === category.trim().toLowerCase()
    );
  }

  // Calculate the total amount of all returned expenses
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  res.status(200).json({
    success: true,
    count: expenses.length,
    total: parseFloat(total.toFixed(2)), // Round to 2 decimal places
    expenses,
  });
}

/**
 * GET /expenses/:id
 * Returns a single expense by its ID.
 * Sends 404 if no expense with that ID exists.
 */
function getExpenseById(req, res) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "Expense ID must be a number",
    });
  }

  const expense = store.getExpenseById(id);

  if (!expense) {
    return res.status(404).json({
      success: false,
      message: `Expense with ID ${id} not found`,
    });
  }

  res.status(200).json({ success: true, expense });
}

/**
 * POST /expenses
 * Creates a new expense from the request body.
 * Required fields: title, amount, category, date.
 */
function createExpense(req, res) {
  const { title, amount, category, date } = req.body;
  const expense = store.createExpense({ title, amount, category, date });

  res.status(201).json({
    success: true,
    message: "Expense created successfully",
    expense,
  });
}

/**
 * PUT /expenses/:id
 * Fully updates an existing expense.
 * All fields (title, amount, category, date) are required in the body.
 */
function updateExpense(req, res) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "Expense ID must be a number",
    });
  }

  const { title, amount, category, date } = req.body;
  const expense = store.updateExpense(id, { title, amount, category, date });

  if (!expense) {
    return res.status(404).json({
      success: false,
      message: `Expense with ID ${id} not found`,
    });
  }

  res.status(200).json({
    success: true,
    message: "Expense updated successfully",
    expense,
  });
}

/**
 * PATCH /expenses/:id
 * Partially updates an expense — only the fields provided in the body are changed.
 * At least one field must be provided.
 */
function patchExpense(req, res) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "Expense ID must be a number",
    });
  }

  const expense = store.patchExpense(id, req.body);

  if (!expense) {
    return res.status(404).json({
      success: false,
      message: `Expense with ID ${id} not found`,
    });
  }

  res.status(200).json({
    success: true,
    message: "Expense updated successfully",
    expense,
  });
}

/**
 * DELETE /expenses/:id
 * Deletes an expense by ID and returns the deleted object.
 */
function deleteExpense(req, res) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "Expense ID must be a number",
    });
  }

  const expense = store.deleteExpense(id);

  if (!expense) {
    return res.status(404).json({
      success: false,
      message: `Expense with ID ${id} not found`,
    });
  }

  res.status(200).json({
    success: true,
    message: "Expense deleted successfully",
    expense,
  });
}

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  patchExpense,
  deleteExpense,
};