# 💸 Expense Tracker API

A modern full-stack expense tracking application built with **Node.js**, **Express.js**, and **Vanilla HTMl, CSS and JavaScript**. This application allows users to create, view, update, filter, and delete expenses through an intuitive and responsive user interface connected to a RESTful API backend.

---

## 📖 Overview

The Expense Tracker API is designed to help users efficiently manage their daily expenses. It provides a clean frontend experience while exposing powerful backend endpoints for expense management.

### Key Features

* Add new expenses
* View all expenses
* Filter expenses by category
* Edit existing expenses
* Delete expenses
* Real-time expense summaries
* Responsive user interface
* RESTful API architecture
* Input validation and error handling

---

## 🏗️ Project Structure

```text
expense-tracker-api/
├── server.js
├── package.json
│
├── routes/
│   └── expenseRoutes.js
│
├── controllers/
│   └── expenseController.js
│
├── data/
│   └── expenseStore.js
│
├── middleware/
│   ├── validateExpense.js
│   └── errorHandler.js
│
├── index.html
├── style.css
├── app.js
│
└── README.md
```

### Folder Description

| Folder/File    | Purpose                       |
| -------------- | ----------------------------- |
| `server.js`     | Application entry point       |
| `routes/`      | Defines API routes            |
| `controllers/` | Handles business logic        |
| `data/`        | Stores application data       |
| `middleware/`  | Validation and error handling |
| `index.html`   | Frontend structure            |
| `style.css`    | User interface styling        |
| `app.js`       | Frontend functionality        |

---

## 🚀 Getting Started

### Prerequisites

Before running the project, ensure you have the following installed:

* Node.js (LTS Version)
* Git
* Postman (Optional)
* Visual Studio Code or any preferred code editor

---

## 📥 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/expense-tracker-api.git
cd expense-tracker-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will run at:

```text
http://localhost:3000
```

---

## 🔗 Frontend Integration

The frontend communicates with the backend using JavaScript's Fetch API.

Example configuration:

```javascript
const API = "http://localhost:3000/expenses";
```

### Enable CORS

Install:

```bash
npm install cors
```

Configure:

```javascript
const cors = require("cors");

app.use(cors());
```

---

## 🛠️ API Documentation

### Base URL

```text
http://localhost:3000
```

### Available Endpoints

| Method | Endpoint                  | Description                  |
| ------ | ------------------------- | ---------------------------- |
| GET    | `/expenses`               | Retrieve all expenses        |
| GET    | `/expenses/:id`           | Retrieve a single expense    |
| GET    | `/expenses?category=food` | Filter expenses by category  |
| POST   | `/expenses`               | Create a new expense         |
| PUT    | `/expenses/:id`           | Update an expense completely |
| PATCH  | `/expenses/:id`           | Update specific fields       |
| DELETE | `/expenses/:id`           | Delete an expense            |

---

## 📄 Expense Object Structure

```json
{
  "id": 1,
  "title": "Lunch at Papaye",
  "amount": 85,
  "category": "food",
  "date": "2026-05-31",
  "createdAt": "2026-05-31T10:00:00.000Z",
  "updatedAt": "2026-05-31T10:00:00.000Z"
}
```

---

## 📂 Supported Categories

* Food
* Transport
* Utilities
* Health
* Education
* Entertainment
* Shopping
* Other

---

## 📌 Example API Requests

### Create Expense

```http
POST /expenses
Content-Type: application/json

{
  "title": "Trotro Fare",
  "amount": 5.50,
  "category": "transport",
  "date": "2026-05-31"
}
```

### Update Expense Amount

```http
PATCH /expenses/1
Content-Type: application/json

{
  "amount": 7.00
}
```

---

## 📊 HTTP Status Codes

| Status Code | Description           |
| ----------- | --------------------- |
| 200         | Request successful    |
| 201         | Resource created      |
| 400         | Validation error      |
| 404         | Resource not found    |
| 500         | Internal server error |

---

## 🎨 Frontend Features

* Expense creation form
* Expense editing
* Expense deletion with confirmation
* Dynamic category filtering
* Real-time statistics
* Toast notifications
* Mobile-friendly responsive design

---

## 🔄 Request Lifecycle

```text
Frontend (HTML/CSS/JavaScript)
        ↓
HTTP Request
        ↓
Express Server
        ↓
Routes
        ↓
Middleware Validation
        ↓
Controllers
        ↓
Data Layer
        ↓
JSON Response
        ↓
Frontend Update
```

---

## 🧪 API Testing

You can test all endpoints using Postman.

Recommended steps:

1. Create a collection named "Expense Tracker API"
2. Add requests for each endpoint
3. Use JSON request bodies for POST, PUT, and PATCH requests
4. Verify responses and status codes

---

## 📦 Dependencies

| Package | Purpose                                     |
| ------- | ------------------------------------------- |
| Express | Backend framework                           |
| Cors    | Cross-origin resource sharing               |
| Nodemon | Automatic server restart during development |

---

## 👨‍💻 Author

**Wisdom Nunakpor**

* Backend Developer (JavaScript)
* BSc. Mathematical Sciences Student
* Aspiring Data Analyst & DevOps Engineer
* Passionate about problem-solving, software development, and technology education

GitHub: https://github.com/wnunakpor001

---

## 📜 License

This project is intended for educational and learning purposes. Feel free to fork, modify, and build upon it for personal or academic use.

---

### ⭐ Support

If you found this project helpful, consider giving it a star on GitHub and sharing it with others.
