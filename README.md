# 💸 Expense Tracker API

A modern **full-stack Expense Tracker application** built with **Node.js**, **Express.js**, **MongoDB**, and **Vanilla HTML, CSS, and JavaScript**. The application enables users to securely manage their expenses through an intuitive interface backed by a RESTful API.

---

## 🌐 Live Links

🚀 Live API: https://expense-tracker-api-4lsu.onrender.com/

📂 GitHub Repository: https://github.com/wnunakpor001/expense-tracker-api

## 🚀 Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Protected routes

### Expense Management

* Create new expenses
* View all personal expenses
* Update existing expenses
* Delete expenses
* Filter expenses by category
* Input validation
* Error handling

### Frontend

* Responsive user interface
* Dynamic expense management
* Fetch API integration
* Real-time updates

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Token (JWT)

### Frontend

* HTML5
* CSS3
* JavaScript (ES6)

### Development Tools

* Nodemon
* Git & GitHub
* Postman

---

## 📂 Project Structure

```text
expense-tracker-api/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   └── expenseController.js
│
├── Frontend_UI/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── middleware/
│   ├── errorHandler.js
│   ├── protect.js
│   └── validateExpense.js
│
├── models/
│   ├── User.js
│   └── Expense.js
│
├── routes/
│   ├── authRoutes.js
│   └── expenseRoutes.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

---

## 📋 Folder Description

| Folder/File    | Description                                    |
| -------------- | ---------------------------------------------- |
| `config/`      | Database connection setup                      |
| `controllers/` | Application business logic                     |
| `models/`      | MongoDB schemas                                |
| `routes/`      | API route definitions                          |
| `middleware/`  | Authentication, validation, and error handling |
| `Frontend_UI/` | Client-side application                        |
| `server.js`    | Application entry point                        |

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/wnunakpor001/expense-tracker-api.git

cd expense-tracker-api
```

### Install dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Run the application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will start on:

```text
http://localhost:3000
```

---

## 🔗 API Endpoints

### Authentication

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login a user        |

### Expenses

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| GET    | `/api/expenses`     | Get all expenses     |
| GET    | `/api/expenses/:id` | Get a single expense |
| POST   | `/api/expenses`     | Create a new expense |
| PUT    | `/api/expenses/:id` | Update an expense    |
| DELETE | `/api/expenses/:id` | Delete an expense    |

> Some routes require JWT authentication.

---

## 📄 Sample Expense Object

```json
{
  "_id": "6840ab12345ef67890",
  "title": "Lunch",
  "amount": 85,
  "category": "Food",
  "date": "2026-06-09",
  "user": "6840ab12345ef67891"
}
```

---

## 🔒 Authentication

This project uses **JSON Web Tokens (JWT)** for authentication.

After login, include the token in the request header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🧪 Testing

You can test the API using:

* Postman
* Thunder Client
* Insomnia

Test authentication first to obtain a JWT token before accessing protected routes.

---

## 📦 Dependencies

* Express.js
* Mongoose
* JSON Web Token
* dotenv
* bcryptjs
* cors
* nodemon

---

## 🔄 Application Flow

```text
Frontend UI
      │
      ▼
HTTP Request
      │
      ▼
Express Server
      │
      ▼
Routes
      │
      ▼
Authentication Middleware
      │
      ▼
Validation Middleware
      │
      ▼
Controllers
      │
      ▼
MongoDB Database
      │
      ▼
JSON Response
      │
      ▼
Frontend Update
```

---

## 👨‍💻 Author

### Wisdom Nunakpor

* BSc. Mathematical Sciences Student
* Junior Backend Developer
* Aspiring Data Analyst & DevOps Engineer
* Passionate about Software Development, Statistics, and Technology Education

**GitHub:** https://github.com/wnunakpor001

---

## 📜 License

This project is developed for educational and learning purposes. You are free to fork, modify, and use it for personal or academic projects.

---

## ⭐ Support

If you found this project useful, consider giving it a **star ⭐ on GitHub**. Contributions, suggestions, and feedback are always welcome.
