// server.js
// Entry point — loads env, connects to MongoDB, mounts all routes.

require("dotenv").config();

const express      = require("express");
const cors         = require("cors");
const path         = require("path");
const connectDB    = require("./config/db");
const expenseRoutes = require("./routes/expenseRoutes");
const authRoutes    = require("./routes/authRoutes");
const errorHandler  = require("./middleware/errorHandler");

const app = express();

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "Frontend_UI")));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/auth",     authRoutes);
app.use("/expenses", expenseRoutes);

// ── Welcome route ─────────────────────────────────────────────────────────────
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to the Expense Tracker API",
    version: "3.0.0",
    endpoints: {
      register:       "POST   /auth/register",
      login:          "POST   /auth/login",
      getAllExpenses:  "GET    /expenses",
      getOneExpense:  "GET    /expenses/:id",
      createExpense:  "POST   /expenses",
      updateExpense:  "PUT    /expenses/:id",
      patchExpense:   "PATCH  /expenses/:id",
      deleteExpense:  "DELETE /expenses/:id",
    },
  });
});

// ── Catch unknown routes ──────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Expense Tracker API running on http://localhost:${PORT}`);
});