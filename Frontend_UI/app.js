// ── CONFIG ────────────────────────────────────────────────────────────────────
const API = "https://expense-tracker-api-4lsu.onrender.com/expenses";

const CATEGORIES = [
  { name: "food",          emoji: "🍔", color: "#ff5c3a" },
  { name: "transport",     emoji: "🚌", color: "#3ae4ff" },
  { name: "utilities",     emoji: "💡", color: "#ffd23f" },
  { name: "health",        emoji: "💊", color: "#ff80ab" },
  { name: "education",     emoji: "📚", color: "#a259ff" },
  { name: "entertainment", emoji: "🎮", color: "#c8f135" },
  { name: "shopping",      emoji: "🛍️", color: "#ff9f43" },
  { name: "other",         emoji: "📦", color: "#b2bec3" },
];

let allExpenses  = [];
let activeFilter = "all";
let selectedCat  = "";

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  buildCategoryButtons();
  setDefaultDate();
  fetchExpenses();
});

function setDefaultDate() {
  document.getElementById("inp-date").value = new Date().toISOString().split("T")[0];
}

function buildCategoryButtons() {
  const grid = document.getElementById("category-grid");
  CATEGORIES.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "cat-btn";
    btn.dataset.cat = cat.name;
    btn.textContent = `${cat.emoji} ${cat.name}`;
    btn.onclick = () => selectCategory(cat.name);
    grid.appendChild(btn);
  });
}

function selectCategory(name) {
  selectedCat = name;
  document.getElementById("inp-category").value = name;
  document.querySelectorAll(".cat-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.cat === name);
  });
}

// ── API CALLS ─────────────────────────────────────────────────────────────────

async function fetchExpenses() {
  try {
    const res  = await fetch(API);
    const data = await res.json();
    allExpenses = data.expenses || [];
    renderAll();
  } catch (e) {
    showToast("❌ Cannot connect to API. Is the server running?", true);
  }
}

async function handleSubmit() {
  const id       = document.getElementById("edit-id").value;
  const title    = document.getElementById("inp-title").value.trim();
  const amount   = document.getElementById("inp-amount").value;
  const category = document.getElementById("inp-category").value;
  const date     = document.getElementById("inp-date").value;

  if (!title)                            return showToast("⚠️ Title is required", true);
  if (!amount || parseFloat(amount) <= 0) return showToast("⚠️ Enter a valid amount", true);
  if (!category)                         return showToast("⚠️ Pick a category", true);
  if (!date)                             return showToast("⚠️ Date is required", true);

  const body = { title, amount: parseFloat(amount), category, date };

  try {
    if (id) {
      // UPDATE existing expense
      const res  = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) return showToast("❌ " + data.message, true);
      showToast("✅ Expense updated!");
    } else {
      // CREATE new expense
      const res  = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) return showToast("❌ " + data.message, true);
      showToast("✅ Expense added!");
    }

    resetForm();
    fetchExpenses();
  } catch (e) {
    showToast("❌ Server error. Try again.", true);
  }
}

async function deleteExpense(id) {
  if (!confirm("Delete this expense?")) return;
  try {
    const res  = await fetch(`${API}/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!data.success) return showToast("❌ " + data.message, true);
    showToast("🗑️ Expense deleted");
    fetchExpenses();
  } catch (e) {
    showToast("❌ Server error.", true);
  }
}

function startEdit(expense) {
  document.getElementById("edit-id").value    = expense.id;
  document.getElementById("inp-title").value  = expense.title;
  document.getElementById("inp-amount").value = expense.amount;
  document.getElementById("inp-date").value   = expense.date;
  selectCategory(expense.category);

  document.getElementById("form-title-text").textContent = "✏️ EDIT EXPENSE";
  document.getElementById("edit-badge").classList.add("visible");
  document.getElementById("btn-submit").textContent = "UPDATE EXPENSE";
  document.getElementById("btn-submit").classList.add("editing");
  document.getElementById("btn-cancel").classList.add("visible");

  // Scroll to form on mobile
  document.querySelector(".form-card").scrollIntoView({ behavior: "smooth", block: "start" });
}

function cancelEdit() {
  resetForm();
}

function resetForm() {
  document.getElementById("edit-id").value    = "";
  document.getElementById("inp-title").value  = "";
  document.getElementById("inp-amount").value = "";
  setDefaultDate();
  selectedCat = "";
  document.getElementById("inp-category").value = "";
  document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));

  document.getElementById("form-title-text").textContent = "➕ ADD EXPENSE";
  document.getElementById("edit-badge").classList.remove("visible");
  document.getElementById("btn-submit").textContent = "ADD EXPENSE";
  document.getElementById("btn-submit").classList.remove("editing");
  document.getElementById("btn-cancel").classList.remove("visible");
}

// ── RENDER ────────────────────────────────────────────────────────────────────

function renderAll() {
  updateStats();
  updateFilters();
  renderList();
}

function renderList() {
  const list  = document.getElementById("expense-list");
  const empty = document.getElementById("empty-state");

  const filtered = activeFilter === "all"
    ? allExpenses
    : allExpenses.filter(e => e.category === activeFilter);

  list.innerHTML = "";

  if (filtered.length === 0) {
    empty.classList.add("visible");
    return;
  }

  empty.classList.remove("visible");

  filtered.forEach(exp => {
    const cat  = CATEGORIES.find(c => c.name === exp.category) || CATEGORIES[7];
    const item = document.createElement("div");
    item.className = "expense-item";
    item.innerHTML = `
      <div class="cat-dot" style="background:${cat.color}22; border-color:${cat.color}">
        ${cat.emoji}
      </div>
      <div class="expense-info">
        <div class="expense-title">${escHtml(exp.title)}</div>
        <div class="expense-meta">
          <span>${formatDate(exp.date)}</span>
          <span class="expense-cat-tag">${exp.category}</span>
        </div>
      </div>
      <div class="expense-amount">$${formatNum(exp.amount)}</div>
      <div class="item-actions">
        <button class="btn-edit" title="Edit" onclick='startEdit(${JSON.stringify(exp)})'>✏️</button>
        <button class="btn-delete" title="Delete" onclick="deleteExpense(${exp.id})">🗑️</button>
      </div>
    `;
    list.appendChild(item);
  });
}

function updateStats() {
  const total = allExpenses.reduce((s, e) => s + e.amount, 0);
  document.getElementById("stat-count").textContent = allExpenses.length;
  document.getElementById("stat-total").textContent = "$" + formatNum(total);

  // Find top category by total spend
  if (allExpenses.length === 0) {
    document.getElementById("stat-top").textContent = "—";
    return;
  }

  const catTotals = {};
  allExpenses.forEach(e => {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  });

  const top    = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0][0];
  const topCat = CATEGORIES.find(c => c.name === top) || CATEGORIES[7];
  document.getElementById("stat-top").textContent = `${topCat.emoji} ${top}`;
}

function updateFilters() {
  const row      = document.getElementById("filter-row");
  const usedCats = [...new Set(allExpenses.map(e => e.category))];

  // Remove existing category filter buttons (keep "All")
  row.querySelectorAll("[data-cat]:not([data-cat='all'])").forEach(b => b.remove());

  usedCats.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (activeFilter === cat ? " active" : "");
    btn.dataset.cat = cat;
    btn.textContent = (CATEGORIES.find(c => c.name === cat)?.emoji || "") + " " + cat;
    btn.onclick = () => filterBy(cat, btn);
    row.appendChild(btn);
  });
}

function filterBy(cat, btn) {
  activeFilter = cat;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderList();
}

// ── HELPERS ───────────────────────────────────────────────────────────────────

function formatNum(n) {
  return parseFloat(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(d) {
  if (!d) return "";
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function escHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

let toastTimer;
function showToast(msg, isError = false) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast show" + (isError ? " error" : "");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.className = "toast"; }, 3000);
}