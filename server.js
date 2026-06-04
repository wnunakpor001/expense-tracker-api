// index.js
// Entry point of the application.
// Loads environment variables, connects to MongoDB, then starts the Express server.

require("dotenv").config(); // Load .env variables first, before anything else

const express    = require("express");
const cors       = require("cors");
const path = require("path");
const connectDB  = require("./config/db");
const expenseRoutes = require("./routes/expenseRoutes"); 
const errorHandler  = require("./middleware/errorHandler");

const app = express();

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
// Serve frontend files
app.use(express.static(path.join(__dirname, "Frontend_UI")));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/expenses", expenseRoutes);

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Expense Tracker API",
    version: "2.0.0",
    database: "MongoDB",
    endpoints: {
      getAllExpenses:  "GET    /expenses",
      getOneExpense:  "GET    /expenses/:id",
      createExpense:  "POST   /expenses",
      updateExpense:  "PUT    /expenses/:id",
      patchExpense:   "PATCH  /expenses/:id",
      deleteExpense:  "DELETE /expenses/:id",
    },
  });
});

// Catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handler — must always be last
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Expense Tracker API running on http://localhost:${PORT}`);
});