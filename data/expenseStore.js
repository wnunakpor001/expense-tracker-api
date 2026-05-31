// data/expenseStore.js
// Acts as our in-memory "database".
// All expenses are stored in this array and persist as long as the server is running.
// Data resets when the server restarts — this is expected since we have no database.

let expenses = [];
let nextId = 1;

/**
 * Returns all expenses.
 */
function getAllExpenses() {
  return expenses;
}

/**
 * Finds and returns a single expense by its numeric ID.
 * Returns undefined if no match is found.
 */
function getExpenseById(id) {
  return expenses.find((expense) => expense.id === id);
}

/**
 * Creates a new expense and adds it to the store.
 * Automatically assigns an ID and timestamps.
 */
function createExpense({ title, amount, category, date }) {
  const newExpense = {
    id: nextId++,
    title: title.trim(),
    amount: parseFloat(amount),       // Store as a number, not a string
    category: category.trim().toLowerCase(),
    date,                              // Expected format: "YYYY-MM-DD"
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  expenses.push(newExpense);
  return newExpense;
}

/**
 * Fully replaces an existing expense's fields.
 * Returns the updated expense, or null if not found.
 */
function updateExpense(id, { title, amount, category, date }) {
  const index = expenses.findIndex((expense) => expense.id === id);
  if (index === -1) return null;

  expenses[index] = {
    ...expenses[index],
    title: title.trim(),
    amount: parseFloat(amount),
    category: category.trim().toLowerCase(),
    date,
    updatedAt: new Date().toISOString(),
  };
  return expenses[index];
}

/**
 * Partially updates only the fields provided.
 * Returns the updated expense, or null if not found.
 */
function patchExpense(id, fields) {
  const index = expenses.findIndex((expense) => expense.id === id);
  if (index === -1) return null;

  if (fields.title !== undefined)    expenses[index].title    = fields.title.trim();
  if (fields.amount !== undefined)   expenses[index].amount   = parseFloat(fields.amount);
  if (fields.category !== undefined) expenses[index].category = fields.category.trim().toLowerCase();
  if (fields.date !== undefined)     expenses[index].date     = fields.date;
  expenses[index].updatedAt = new Date().toISOString();

  return expenses[index];
}

/**
 * Deletes an expense from the store by ID.
 * Returns the deleted expense, or null if not found.
 */
function deleteExpense(id) {
  const index = expenses.findIndex((expense) => expense.id === id);
  if (index === -1) return null;

  const deleted = expenses.splice(index, 1)[0];
  return deleted;
}

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  patchExpense,
  deleteExpense,
};