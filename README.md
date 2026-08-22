# 📚 Mini Library Application & Late Fee Tracker

A lightweight, full-stack dashboard designed to track borrowed books, their due dates, and dynamically calculate late fee penalties based on tiered pricing rules.

---

## 🚀 Features

* **Server-Side Penalty Calculation Engine:**
  * Standard 7-day borrowing period.
  * **$1.00 per day** for the first 3 days overdue (Days 1–3).
  * **$2.00 per day** for every day after (Day 4+).
  * Maximum penalty per book capped at **$15.00**.
* **Dynamic Color-Coded Statuses:**
  * 🟢 **Safe (Green):** Book is not due yet.
  * 🟡 **Due Tomorrow (Yellow):** Book is due tomorrow.
  * 🔴 **Overdue (Red):** Book is overdue (displays dynamic backend-calculated penalty fee).
* **Interactive Frontend:**
  * Clean, classic React dashboard built with Vite.
  * Borrowing form with Title, Borrower Name, Description, and Checkout Date Picker.
  * Filter tabs: `All`, `Overdue`, `Due Tomorrow`, `Safe`.
* **MySQL Database Persistence:**
  * Relational storage using Node.js `mysql2` driver with promise pool.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite, Vanilla CSS
* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **Deployment:** Vercel (Frontend), Render / Railway (Backend)

---

## 📁 Repository Structure

```
Mini Library Application/
├── backend/
│   ├── .env.example              # Environment variables template
│   ├── db.js                     # MySQL database pool & initialization
│   ├── server.js                 # Express server & API endpoints
│   └── utils/
│       └── penaltyCalculator.js  # Core server-side penalty calculation algorithm
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx               # Main dashboard component
│       ├── index.css             # Classic UI styling
│       └── components/
│           ├── Header.jsx        # App header & seed button
│           ├── PenaltyRuleBanner.jsx # Rule breakdown banner
│           ├── BookForm.jsx      # Form to borrow books
│           ├── BookCard.jsx      # Color-coded book card
│           └── BookGrid.jsx      # Status-filtered books grid
└── README.md
```

---

## 💻 Local Setup Instructions

### Prerequisites
* **Node.js** (v18 or higher)
* **MySQL Server** running locally (or remote MySQL connection credentials)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file based on template
cp .env.example .env
```

Edit `backend/.env` with your MySQL credentials:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=mini_library_db
```

Start the backend server:
```bash
# Development mode
npm run dev
```
The API server will run at: `http://localhost:5000`

---

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
The React UI will run at: `http://localhost:3000`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/books` | Fetches all books enriched with server-calculated penalty fees & dynamic statuses |
| `POST` | `/api/books` | Adds a new borrowed book record (`title`, `borrower_name`, `checkout_date`, `description`) |
| `DELETE` | `/api/books/:id` | Returns/deletes a borrowed book record from MySQL by ID |
| `GET` | `/api/health` | Health check endpoint |

---

## 🎥 3-Minute Video Presentation Guide

When recording your mandatory 3-minute screen share:

1. **Introduction (0:00 - 0:30):**
   * Introduce yourself and state the project goal (Library Borrowing & Tiered Late Fee Dashboard).
2. **UI & Feature Walkthrough (0:30 - 1:30):**
   * Show the existing books loaded from the MySQL database in the grid.
   * Demonstrate the **Green Badge** (`SAFE`), **Yellow Badge** (`DUE_TOMORROW`), and **Red Badges** (`OVERDUE` with $2, $7, and $15 capped fees).
   * Fill out the **Borrow Book Form** on screen with a backdated checkout date to show a new book appearing with its status.
3. **Backend Code Walkthrough (1:30 - 3:00):**
   * Open `backend/utils/penaltyCalculator.js` in VS Code.
   * Walk through:
     1. Date subtraction math (`currentDate` vs `dueDate`).
     2. Days overdue calculation.
     3. Tier 1 ($1/day for first 3 days) and Tier 2 ($2/day after day 3).
     4. Penalty cap check (`Math.min(penalty, 15)`).
