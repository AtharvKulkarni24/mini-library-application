import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PenaltyRuleBanner from './components/PenaltyRuleBanner';
import BookForm from './components/BookForm';
import BookGrid from './components/BookGrid';

export default function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seedLoading, setSeedLoading] = useState(false);

  // Fetch books from Node.js backend
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/books');
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

  // Handle seeding sample test data for video presentation demo
  const handleSeedData = async () => {
    try {
      setSeedLoading(true);
      const res = await fetch('/api/books/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchBooks();
      }
    } catch (error) {
      console.error('Error seeding data:', error);
    } finally {
      setSeedLoading(false);
    }
  };

  return (
    <div className="container">
      <Header onSeed={handleSeedData} loading={seedLoading} />
      <PenaltyRuleBanner />

      <main className="dashboard-grid">
        <aside>
          <BookForm onBookAdded={handleBookAdded} />
        </aside>

        <section>
          <BookGrid books={books} loading={loading} />
        </section>
      </main>
    </div>
  );
}
