import React, { useState } from 'react';
import BookCard from './BookCard';

export default function BookGrid({ books, loading, onBookDeleted }) {
  const [filter, setFilter] = useState('ALL');

  const filteredBooks = books.filter(book => {
    if (filter === 'ALL') return true;
    return book.status === filter;
  });

  const getCount = (statusType) => {
    if (statusType === 'ALL') return books.length;
    return books.filter(b => b.status === statusType).length;
  };

  return (
    <div>
      <div className="grid-header">
        <h2 className="grid-title">Borrowed Books ({filteredBooks.length})</h2>

        <div className="filter-tabs">
          <button
            className={`tab-btn ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            All ({getCount('ALL')})
          </button>
          <button
            className={`tab-btn ${filter === 'OVERDUE' ? 'active' : ''}`}
            onClick={() => setFilter('OVERDUE')}
          >
            Overdue ({getCount('OVERDUE')})
          </button>
          <button
            className={`tab-btn ${filter === 'DUE_TOMORROW' ? 'active' : ''}`}
            onClick={() => setFilter('DUE_TOMORROW')}
          >
            Due Tomorrow ({getCount('DUE_TOMORROW')})
          </button>
          <button
            className={`tab-btn ${filter === 'SAFE' ? 'active' : ''}`}
            onClick={() => setFilter('SAFE')}
          >
            Safe ({getCount('SAFE')})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <p>Loading books from backend server...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="empty-state">
          <p>No books found for this filter.</p>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Add a new book using the form on the left to get started.
          </span>
        </div>
      ) : (
        <div className="books-container">
          {filteredBooks.map(book => (
            <BookCard key={book.id} book={book} onBookDeleted={onBookDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}
