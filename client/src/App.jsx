import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import PenaltyRuleBanner from './components/PenaltyRuleBanner';
import StatsOverview from './components/StatsOverview';
import BookCard from './components/BookCard';
import BookFormModal from './components/BookFormModal';
import PenaltyBreakdownModal from './components/PenaltyBreakdownModal';
import { Search, Filter, RefreshCw, BookOpen, AlertCircle } from 'lucide-react';

// API Base URL - defaults to relative URL locally or VITE_API_BASE_URL on Vercel
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function App() {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search state
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Evaluation date simulation state
  const [simulatedDate, setSimulatedDate] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBreakdownBook, setSelectedBreakdownBook] = useState(null);

  // Fetch books from Express API
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `${API_BASE}/api/books`;
      if (simulatedDate) {
        url += `?currentDate=${simulatedDate}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);

      const result = await res.json();
      if (result.success) {
        setBooks(result.data);
        setStats(result.stats);
      } else {
        throw new Error(result.error || 'Failed to load books');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Unable to connect to backend server. Please verify backend API status.');
    } finally {
      setLoading(false);
    }
  }, [simulatedDate]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Add new book handler
  const handleAddBook = async (bookData) => {
    const res = await fetch(`${API_BASE}/api/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData)
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.error || 'Could not save book record');
    }

    await fetchBooks();
  };

  // Return book handler
  const handleReturnBook = async (id, title) => {
    if (!window.confirm(`Mark "${title}" as returned and remove record?`)) return;

    try {
      const res = await fetch(`${API_BASE}/api/books/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        await fetchBooks();
      } else {
        alert(result.error || 'Failed to remove record');
      }
    } catch (err) {
      alert('Error connecting to server.');
    }
  };

  // Filter books based on search term & status category
  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.borrowerName.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'ALL') return matchesSearch;
    return matchesSearch && b.status === filterStatus;
  });

  return (
    <div className="app-container">
      {/* Header with Brand & Date Simulator */}
      <Header
        simulatedDate={simulatedDate}
        onSimulatedDateChange={(val) => setSimulatedDate(val)}
        onResetDate={() => setSimulatedDate('')}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Penalty Calculation Policy Banner */}
      <PenaltyRuleBanner />

      {/* Stats Summary Overview */}
      <StatsOverview stats={stats} />

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
            <Search size={17} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ width: '100%', paddingLeft: '2.4rem' }}
              placeholder="Search by book title or borrower name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '600', marginRight: '0.2rem' }}>
              Filter:
            </span>
            {[
              { id: 'ALL', label: 'All Books' },
              { id: 'SAFE', label: '🟢 Safe' },
              { id: 'DUE_TOMORROW', label: '🟡 Due Tomorrow' },
              { id: 'OVERDUE', label: '🔴 Overdue' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className="btn-secondary"
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.82rem',
                  background: filterStatus === tab.id ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.04)',
                  borderColor: filterStatus === tab.id ? 'var(--accent-primary)' : 'var(--border-color)',
                  color: filterStatus === tab.id ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                {tab.label}
              </button>
            ))}

            <button
              onClick={fetchBooks}
              className="btn-secondary"
              title="Refresh dataset from backend"
              style={{ padding: '0.4rem 0.6rem' }}
            >
              <RefreshCw size={15} />
            </button>
          </div>

        </div>
      </div>

      {/* Main Book Grid Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <RefreshCw size={32} className="spin" style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem', color: 'var(--accent-primary)' }} />
          <p>Calculating server penalties and loading records...</p>
        </div>
      ) : error ? (
        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <AlertCircle size={40} color="#f87171" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#f87171', marginBottom: '0.5rem' }}>Connection Error</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>{error}</p>
          <button className="btn-primary" onClick={fetchBooks}>Retry Connection</button>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
          <BookOpen size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>No borrowed books found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            {searchTerm || filterStatus !== 'ALL' ? 'Try adjusting your search or filter parameters.' : 'Click "Borrow Book" to record your first book checkout.'}
          </p>
          <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
            Borrow a Book Now
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onReturnBook={handleReturnBook}
              onSelectBreakdown={(b) => setSelectedBreakdownBook(b)}
            />
          ))}
        </div>
      )}

      {/* Add Book Modal */}
      <BookFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddBook}
        currentDate={simulatedDate}
      />

      {/* Penalty Audit Breakdown Modal */}
      <PenaltyBreakdownModal
        book={selectedBreakdownBook}
        onClose={() => setSelectedBreakdownBook(null)}
      />
    </div>
  );
}
