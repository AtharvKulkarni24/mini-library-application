import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PenaltyRuleBanner from './components/PenaltyRuleBanner';
import BookForm from './components/BookForm';
import BookGrid from './components/BookGrid';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch books from Node.js backend
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/books`);
      const data = await res.json();
      if (data.success) {
        setBooks(data.data);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Handle adding a new book from the form
  const handleBookAdded = (newBook) => {
    setBooks(prev => [newBook, ...prev]);
  };

  // Handle returning/deleting a book
  const handleBookDeleted = (id) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  };

  return (
    <div className="container">
      <Header />
      <PenaltyRuleBanner />

      <main className="dashboard-grid">
        <aside>
          <BookForm onBookAdded={handleBookAdded} />
        </aside>

        <section>
          <BookGrid books={books} loading={loading} onBookDeleted={handleBookDeleted} />
        </section>
      </main>
    </div>
  );
}
