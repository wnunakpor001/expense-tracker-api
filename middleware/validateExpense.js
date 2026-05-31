// middleware/validateExpense.js
// Validates request body fields before they reach the controller.
// If validation fails, a 400 response is sent immediately —
// the request never reaches the route handler.

const VALID_CATEGORIES = [
  "food",
  "transport",
  "utilities",
  "health",
  "education",
  "entertainment",
  "shopping",
  "other",
];

// Checks if a string matches the date format YYYY-MM-DD
function isValidDate(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr))
  return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * Used on POST and PUT routes — all fields are required.
 */
function validateFullExpense(req, res, next) {
  const { title, amount, category, date } = req.body;
  const errors = [];

  if (!title || title.trim() === "") {
    errors.push("title is required and cannot be empty");
  }

  if (amount === undefined || amount === null || amount === "") {
    errors.push("amount is required");
  } else if (isNaN(amount) || parseFloat(amount) <= 0) {
    errors.push("amount must be a positive number");
  }

  if (!category || category.trim() === "") {
    errors.push("category is required");
  } else if (!VALID_CATEGORIES.includes(category.trim().toLowerCase())) {
    errors.push(`category must be one of: ${VALID_CATEGORIES.join(", ")}`);
  }

  if (!date || date.trim() === "") {
    errors.push("date is required");
  } else if (!isValidDate(date)) {
    errors.push("date must be a valid date in YYYY-MM-DD format (e.g. 2026-05-31)");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next(); // All good — pass to controller
}

/**
 * Used on PATCH routes — only validates fields that are actually provided.
 * At least one field must be present.
 */
function validatePartialExpense(req, res, next) {
  const { title, amount, category, date } = req.body;
  const errors = [];

  // Ensure at least one field is being updated
  if (
    title === undefined &&
    amount === undefined &&
    category === undefined &&
    date === undefined
  ) {
    errors.push("provide at least one field to update: title, amount, category, or date");
  }

  if (title !== undefined && title.trim() === "") {
    errors.push("title cannot be empty");
  }

  if (amount !== undefined) {
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      errors.push("amount must be a positive number");
    }
  }

  if (category !== undefined) {
    if (!VALID_CATEGORIES.includes(category.trim().toLowerCase())) {
      errors.push(`category must be one of: ${VALID_CATEGORIES.join(", ")}`);
    }
  }

  if (date !== undefined) {
    if (!isValidDate(date)) {
      errors.push("date must be a valid date in YYYY-MM-DD format (e.g. 2026-05-31)");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
}

module.exports = { validateFullExpense, validatePartialExpense };