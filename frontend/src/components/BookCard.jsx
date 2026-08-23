import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function BookCard({ book, onBookDeleted }) {
  const { id, title, description, borrower_name, checkout_date, dueDate, daysOverdue, penalty, status } = book;
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleConfirmReturn = async () => {
    try {
      setDeleting(true);
      setErrorMsg('');
      const res = await fetch(`${API_BASE}/api/books/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (onBookDeleted) {
          onBookDeleted(id);
        }
      } else {
        setErrorMsg(data.message || 'Failed to return book.');
        setShowConfirm(false);
      }
    } catch (err) {
      console.error('Error returning book:', err);
      setErrorMsg('Network error while returning book.');
      setShowConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'SAFE':
        return 'Safe';
      case 'DUE_TOMORROW':
        return 'Due Tomorrow';
      case 'OVERDUE':
        return `Overdue (${daysOverdue} ${daysOverdue === 1 ? 'day' : 'days'})`;
      default:
        return status;
    }
  };

  const statusClass = status ? status.toLowerCase() : 'safe';

  return (
    <div className={`book-card status-${statusClass}`}>
      <div>
        <div className="book-header">
          <h3 className="book-title">{title}</h3>
          <span className={`status-badge ${statusClass}`}>
            {getStatusLabel()}
          </span>
        </div>

        <div className="book-meta">
          <p><strong>Borrower:</strong> {borrower_name}</p>
          <p><strong>Checked Out:</strong> {checkout_date}</p>
          <p><strong>Due Date:</strong> {dueDate}</p>
        </div>

        {description && (
          <p className="book-description" title={description}>
            {description}
          </p>
        )}
      </div>

      <div>
        <div className="book-footer">
          {status === 'OVERDUE' ? (
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Late Fee Penalty</span>
              <span className="penalty-amount">${penalty.toFixed(2)}</span>
            </div>
          ) : (
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Late Fee Penalty</span>
              <span style={{ fontWeight: 600, color: '#059669' }}>$0.00</span>
            </div>
          )}

          {!showConfirm && (
            <button
              className="btn-return"
              onClick={() => { setShowConfirm(true); setErrorMsg(''); }}
              disabled={deleting}
              title="Mark book as returned"
            >
              ✓ Return Book
            </button>
          )}
        </div>

        {showConfirm && (
          <div className="card-confirm-box">
            <div className="card-confirm-text">Return "{title}"?</div>
            <div className="card-confirm-actions">
              <button
                className="btn-confirm-yes"
                onClick={handleConfirmReturn}
                disabled={deleting}
              >
                {deleting ? 'Returning...' : 'Yes, Return'}
              </button>
              <button
                className="btn-confirm-cancel"
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="card-error-msg">
            ⚠️ {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}
