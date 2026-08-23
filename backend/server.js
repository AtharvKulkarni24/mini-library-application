const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDB, addBook, getAllBooks, deleteBook } = require('./db');
const { calculatePenaltyAndStatus } = require('./utils/penaltyCalculator');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : '*';
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Initialize Database connection on server startup
initDB();

/**
 * Formats a MySQL date or string input safely to YYYY-MM-DD without UTC timezone shifting.
 */
const formatDateStr = (dateVal) => {
  if (!dateVal) return '';
  if (typeof dateVal === 'string') {
    return dateVal.split('T')[0];
  }
  if (dateVal instanceof Date) {
    const year = dateVal.getFullYear();
    const month = String(dateVal.getMonth() + 1).padStart(2, '0');
    const day = String(dateVal.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return String(dateVal);
};

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mini Library API is running' });
});

/**
 * GET /api/books
 * Retrieves all books enriched with dynamically calculated penalty fees and statuses.
 */
app.get('/api/books', async (req, res) => {
  try {
    const rawBooks = await getAllBooks();

    // Map each book through the server-side penalty calculator
    const enrichedBooks = rawBooks.map(book => {
      // Standardize date string to YYYY-MM-DD without timezone shift
      const checkoutDateStr = formatDateStr(book.checkout_date);
      const penaltyData = calculatePenaltyAndStatus(checkoutDateStr);

      return {
        id: book.id,
        title: book.title,
        description: book.description || '',
        borrower_name: book.borrower_name,
        checkout_date: checkoutDateStr,
        ...penaltyData
      };
    });

    res.json({
      success: true,
      count: enrichedBooks.length,
      data: enrichedBooks
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching books' });
  }
});

/**
 * POST /api/books
 * Creates a new borrowed book record.
 * Body: { title, description, borrower_name, checkout_date }
 */
app.post('/api/books', async (req, res) => {
  try {
    const { title, description, borrower_name, checkout_date } = req.body;

    // Validation
    if (!title || !borrower_name || !checkout_date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, borrower_name, and checkout_date.'
      });
    }

    const newBook = await addBook({
      title: title.trim(),
      description: description ? description.trim() : '',
      borrower_name: borrower_name.trim(),
      checkout_date
    });

    const checkoutDateStr = formatDateStr(newBook.checkout_date);
    const penaltyData = calculatePenaltyAndStatus(checkoutDateStr);

    const enrichedBook = {
      id: newBook.id,
      title: newBook.title,
      description: newBook.description,
      borrower_name: newBook.borrower_name,
      checkout_date: checkoutDateStr,
      ...penaltyData
    };

    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      data: enrichedBook
    });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ success: false, message: 'Server error while adding book' });
  }
});

/**
 * DELETE /api/books/:id
 * Removes/returns a borrowed book from the database.
 */
app.delete('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await deleteBook(id);

    if (!success) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.json({ success: true, message: 'Book returned successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ success: false, message: 'Server error while returning book' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Mini Library Backend API listening on port ${PORT}`);
  console.log(`   GET    http://localhost:${PORT}/api/books`);
  console.log(`   POST   http://localhost:${PORT}/api/books`);
  console.log(`   DELETE http://localhost:${PORT}/api/books/:id`);
});
