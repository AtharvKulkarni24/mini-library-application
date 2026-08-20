# 📚 LibroPulse - Mini Library Application Dashboard

A lightweight, modern web application to track borrowed books, their due dates, and dynamically calculate server-side late fees based on a specific pricing tier structure.

---

## 🚀 Live Demo & Repository

- **Frontend (Vercel)**: `https://mini-library-application.vercel.app` *(Replace with your Vercel deployment URL)*
- **Backend API (Render)**: `https://mini-library-backend.onrender.com` *(Replace with your Render deployment URL)*
- **GitHub Repository**: `https://github.com/username/mini-library-application`

---

## ✨ Features & Highlights

1. **Server-Side Penalty Engine**:
   - Every book has a standard **7-day borrowing period**.
   - **Tier 1**: **$1 per day** for the first 3 days overdue (Days 1–3).
   - **Tier 2**: **$2 per day** for every day after that (Days 4+).
   - **Maximum Cap**: Penalty per book is strictly capped at **$15.00 max**.
2. **Dynamic UI Status Indicators**:
   - 🟢 **Green (Safe)**: Not due yet (2+ days remaining or due today).
   - 🟡 **Yellow (Due Tomorrow)**: Exactly 1 day remaining until due date.
   - 🔴 **Red (Overdue)**: Book is past due date, displays the exact calculated penalty fee fetched from backend.
3. **Interactive Fee Audit Popover**: Click **Fee Info** on any overdue book to inspect a step-by-step audit of how the fee was calculated across pricing tiers.
4. **Simulated Date Tool**: Test different dates directly from the UI header without changing your machine system time!
5. **Full REST API**: Clean Express backend with health check, fetch books, add book, and return book endpoints.

---

## 🧮 Penalty Calculation Rules & Logic Walkthrough

The server calculates late fees using normalized UTC date arithmetic to ensure timezone independence.

### Formula & Code Block (`server/utils/penalty.js`)

```javascript
const STANDARD_BORROW_DAYS = 7;
const MAX_PENALTY = 15;

function calculateBookPenalty(checkoutDateStr, referenceDate = new Date()) {
  const refDateObj = new Date(referenceDate);
  const refMs = Date.UTC(refDateObj.getFullYear(), refDateObj.getMonth(), refDateObj.getDate());

  const checkoutDateObj = new Date(checkoutDateStr);
  const checkoutMs = Date.UTC(checkoutDateObj.getFullYear(), checkoutDateObj.getMonth(), checkoutDateObj.getDate());

  const dueMs = checkoutMs + (STANDARD_BORROW_DAYS * 24 * 60 * 60 * 1000);
  const daysDiff = Math.floor((refMs - dueMs) / (24 * 60 * 60 * 1000));

  let finalPenalty = 0;
  let status = 'SAFE';
  let badgeColor = 'green';

  if (daysDiff > 0) {
    status = 'OVERDUE';
    badgeColor = 'red';
    
    // Tier 1: First 3 days @ $1/day
    const tier1Days = Math.min(daysDiff, 3);
    const tier1Fee = tier1Days * 1;

    // Tier 2: Days 4+ @ $2/day
    const tier2Days = Math.max(0, daysDiff - 3);
    const tier2Fee = tier2Days * 2;

    const rawPenalty = tier1Fee + tier2Fee;
    
    // Apply Maximum Cap of $15
    finalPenalty = Math.min(MAX_PENALTY, rawPenalty);
  } else if (Math.floor((dueMs - refMs) / (24 * 60 * 60 * 1000)) === 1) {
    status = 'DUE_TOMORROW';
    badgeColor = 'yellow';
  }

  return { status, badgeColor, daysOverdue: daysDiff > 0 ? daysDiff : 0, penalty: finalPenalty };
}
```

### Calculation Examples Table

| Days Overdue | Tier 1 Calculation ($1/day) | Tier 2 Calculation ($2/day) | Raw Fee | Final Fee (Capped @ $15) | Status Badge |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **0 Days** (Due today/future) | $0 | $0 | $0.00 | **$0.00** | 🟢 Safe |
| **1 Day** | 1 × $1 = $1 | $0 | $1.00 | **$1.00** | 🔴 Overdue |
| **3 Days** | 3 × $1 = $3 | $0 | $3.00 | **$3.00** | 🔴 Overdue |
| **4 Days** | 3 × $1 = $3 | 1 × $2 = $2 | $5.00 | **$5.00** | 🔴 Overdue |
| **8 Days** | 3 × $1 = $3 | 5 × $2 = $10 | $13.00 | **$13.00** | 🔴 Overdue |
| **20 Days** | 3 × $1 = $3 | 17 × $2 = $34 | $37.00 | **$15.00** *(Cap)* | 🔴 Overdue |

---

## 🛠️ Local Development & Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/username/mini-library-application.git
cd mini-library-application

# Install root & backend dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..
```

### 2. Run Penalty Logic Unit Tests
```bash
npm test
```

### 3. Run Application Locally
```bash
# Starts Express server (port 5000) and React Vite client (port 3000) concurrently
npm run dev
```

Open your browser at `http://localhost:3000` (or `http://localhost:5000`).

---

## 🌐 Deploying Backend on Render & Frontend on Vercel

### Step A: Deploy Backend on Render
1. Push your repository to **GitHub**.
2. Log in to [Render.com](https://render.com) and click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Set settings:
   - **Root Directory**: `.` (or Leave empty)
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Environment Variables**: `PORT = 5000`, `NODE_ENV = production`
5. Click **Create Web Service**.
6. Copy your live Render URL (e.g. `https://mini-library-backend.onrender.com`).

### Step B: Deploy Frontend on Vercel
1. Log in to [Vercel.com](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository.
3. Set configuration:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_BASE_URL` = `https://mini-library-backend.onrender.com` (Your Render URL)
4. Click **Deploy**.
5. Vercel will build and provide your live frontend URL!

---

## 📹 3-Minute Video Presentation Script (Mandatory Walkthrough)

When recording your 3-minute screen share video, follow this agenda:

1. **0:00 - 0:30 (App Overview & Live UI)**:
   - Introduce yourself and open the live web dashboard.
   - Highlight the **Stats Cards**, **Policy Banner**, and the 3 dynamic color-coded statuses (🟢 Green Safe, 🟡 Yellow Due Tomorrow, 🔴 Red Overdue).
2. **0:30 - 1:15 (Borrowing & Date Simulation Demo)**:
   - Click **Borrow Book** and add a new book (e.g. "Grokking Algorithms", Borrower "Sarah").
   - Use the **Simulated Date Picker** in the top header to fast-forward system time by 8 days, demonstrating how books shift dynamically from Green -> Yellow -> Red in real time!
3. **1:15 - 2:30 (Code Walkthrough - Server Penalty Logic)**:
   - Open `server/utils/penalty.js` in VS Code.
   - Explain line-by-line:
     - 7-day due date calculation (`checkoutMs + 7 * 86400000`).
     - Tier 1 ($1/day for days 1..3).
     - Tier 2 ($2/day for days 4+).
     - Capping logic (`Math.min(15, rawPenalty)`).
   - Show the **Fee Info** modal popover in the UI corresponding to these calculations.
4. **2:30 - 3:00 (Deployment & Summary)**:
   - Show the live Vercel frontend URL and Render backend health endpoint (`/api/health`).
   - Wrap up presentation.

---

## 📄 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/books` | Fetch all books with server-calculated penalty metadata and status stats. Supports optional `?currentDate=YYYY-MM-DD`. |
| `POST` | `/api/books` | Add a new borrowed book (`title`, `borrowerName`, `checkoutDate`). |
| `DELETE` | `/api/books/:id` | Return a book and remove its record. |
| `GET` | `/api/health` | Health check endpoint returning `{ status: 'OK' }`. |

---

## 📜 License
MIT License. Created for the Mini Library Application Technical Assessment.
