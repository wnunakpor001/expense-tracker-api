// server.js
// Entry point of the application.
// Sets up Express, registers middleware, and mounts the expense routes.
require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const cors = require("cors");   // line 1 — import it
const expenseRoutes = require("./routes/expenseRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(cors());                 // line 2 — use it, BEFORE your routes

// Parse incoming JSON request bodies
app.use(express.json());

// Mount all expense routes under /expenses
app.use("/expenses", expenseRoutes);

// Welcome route — useful for quickly confirming the server is alive
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Expense Tracker API",
    version: "1.0.0",
    endpoints: {
      getAllExpenses:    "GET    /expenses",
      getOneExpense:    "GET    /expenses/:id",
      createExpense:    "POST   /expenses",
      updateExpense:    "PUT    /expenses/:id",
      patchExpense:     "PATCH  /expenses/:id",
      deleteExpense:    "DELETE /expenses/:id",
    },
  });
});

// Catch-all for any routes not defined above
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handler — must always be the last middleware registered
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Expense Tracker API running on http://localhost:${PORT}`);
  console.log("\nAvailable routes:");
  console.log("  GET    /expenses");
  console.log("  GET    /expenses/:id");
  console.log("  POST   /expenses");
  console.log("  PUT    /expenses/:id");
  console.log("  PATCH  /expenses/:id");
  console.log("  DELETE /expenses/:id");
});