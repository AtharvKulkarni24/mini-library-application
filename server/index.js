const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { calculateBookPenalty, formatDate, calculateDueDate } = require('./utils/penalty');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Database initialized with diverse seed records for demonstration
let booksStore = [
  {
    id: 'b-101',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    borrowerName: 'Alice Johnson',
    checkoutDate: '2026-08-18', // Safe (Due Aug 25)
    createdAt: new Date('2026-08-18T10:00:00Z').toISOString()
  },
  {
    id: 'b-102',
    title: 'Designing Data-Intensive Applications',
    borrowerName: 'Bob Smith',
    checkoutDate: '2026-08-14', // Due tomorrow (Due Aug 21)
    createdAt: new Date('2026-08-14T14:30:00Z').toISOString()
  },
  {
    id: 'b-103',
    title: 'The Pragmatic Programmer',
    borrowerName: 'Charlie Davis',
    checkoutDate: '2026-08-10', // Overdue by 3 days -> $3 penalty
    createdAt: new Date('2026-08-10T09:15:00Z').toISOString()
  },
  {
    id: 'b-104',
    title: 'Structure and Interpretation of Computer Programs',
    borrowerName: 'Diana Prince',
    checkoutDate: '2026-08-08', // Overdue by 5 days -> $7 penalty ($3 + $4)
    createdAt: new Date('2026-08-08T11:45:00Z').toISOString()
  },
  {
    id: 'b-105',
    title: 'Introduction to Algorithms (CLRS)',
    borrowerName: 'Ethan Hunt',
    checkoutDate: '2026-07-20', // Overdue by 24 days -> $15 penalty (Max Capped)
    createdAt: new Date('2026-07-20T16:20:00Z').toISOString()
  }
];

/**
 * GET /api/books
 * Accepts optional query parameter `currentDate` (YYYY-MM-DD) to support dynamic date simulation
 */
app.get('/api/books', (req, res) => {
  try {
    const { currentDate } = req.query;
    const refDate = currentDate || formatDate(new Date());

    const processedBooks = booksStore.map((book) => {
      const penaltyMeta = calculateBookPenalty(book.checkoutDate, refDate);
      return {
        id: book.id,
        title: book.title,
        borrowerName: book.borrowerName,
        checkoutDate: book.checkoutDate,
        dueDate: penaltyMeta.dueDate,
        status: penaltyMeta.status,
        badgeColor: penaltyMeta.badgeColor,
        daysOverdue: penaltyMeta.daysOverdue,
        daysRemaining: penaltyMeta.daysRemaining,
        penalty: penaltyMeta.penalty,
        breakdown: penaltyMeta.breakdown,
        createdAt: book.createdAt
      };
    });

    // Compute summary metrics
    const stats = {
      totalBooks: processedBooks.length,
      safeCount: processedBooks.filter((b) => b.status === 'SAFE').length,
      dueTomorrowCount: processedBooks.filter((b) => b.status === 'DUE_TOMORROW').length,
      overdueCount: processedBooks.filter((b) => b.status === 'OVERDUE').length,
      totalPenalties: processedBooks.reduce((sum, b) => sum + b.penalty, 0),
      evaluationDate: refDate
    };

    res.json({
      success: true,
      data: processedBooks,
      stats
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ success: false, error: 'Failed to process books data' });
  }
});

/**
 * POST /api/books
 * Body: { title, borrowerName, checkoutDate }
 */
app.post('/api/books', (req, res) => {
  try {
    const { title, borrowerName, checkoutDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Book title is required.' });
    }
    if (!borrowerName || !borrowerName.trim()) {
      return res.status(400).json({ success: false, error: 'Borrower name is required.' });
    }
    if (!checkoutDate) {
      return res.status(400).json({ success: false, error: 'Checkout date is required.' });
    }

    const formattedCheckout = formatDate(new Date(checkoutDate));
    const newBook = {
      id: 'b-' + Date.now(),
      title: title.trim(),
      borrowerName: borrowerName.trim(),
      checkoutDate: formattedCheckout,
      createdAt: new Date().toISOString()
    };

    booksStore.unshift(newBook);

    // Calculate initial status for response
    const penaltyMeta = calculateBookPenalty(newBook.checkoutDate, new Date());
    const responseData = {
      ...newBook,
      dueDate: penaltyMeta.dueDate,
      status: penaltyMeta.status,
      badgeColor: penaltyMeta.badgeColor,
      daysOverdue: penaltyMeta.daysOverdue,
      daysRemaining: penaltyMeta.daysRemaining,
      penalty: penaltyMeta.penalty,
      breakdown: penaltyMeta.breakdown
    };

    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully.',
      data: responseData
    });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ success: false, error: 'Failed to add borrowed book' });
  }
});

/**
 * DELETE /api/books/:id
 * Remove or return a borrowed book
 */
app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const initialLen = booksStore.length;
  booksStore = booksStore.filter((b) => b.id !== id);

  if (booksStore.length === initialLen) {
    return res.status(404).json({ success: false, error: 'Book record not found.' });
  }

  res.json({ success: true, message: 'Book returned and record removed successfully.' });
});

/**
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static frontend assets if built
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Start Express server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Mini Library API server listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
