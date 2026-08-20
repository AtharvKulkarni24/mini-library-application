import React from 'react';
import { User, Calendar, Clock, AlertCircle, CheckCircle, Info, Trash2 } from 'lucide-react';

export default function BookCard({ book, onReturnBook, onSelectBreakdown }) {
  // Determine badge styling based on backend returned status & color
  const isRed = book.badgeColor === 'red';
  const isYellow = book.badgeColor === 'yellow';
  const isGreen = book.badgeColor === 'green';

  let statusLabel = 'Safe (Not Due)';
  if (isYellow) statusLabel = 'Due Tomorrow';
  if (isRed) statusLabel = `Overdue (${book.daysOverdue} ${book.daysOverdue === 1 ? 'day' : 'days'})`;

  return (
    <div
      className={`glass-panel book-card card-${book.badgeColor}`}
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        gap: '1.25rem'
      }}
    >
      {/* Top Header: Badge & Return Button */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <span className={`status-badge ${book.badgeColor}`}>
            <span className="status-dot"></span>
            {statusLabel}
          </span>

          <button
            onClick={() => onReturnBook(book.id, book.title)}
            className="btn-secondary"
            title="Return Book & Clear Record"
            style={{
              padding: '0.35rem 0.6rem',
              fontSize: '0.75rem',
              color: '#f87171',
              borderColor: 'rgba(239, 68, 68, 0.2)'
            }}
          >
            <Trash2 size={14} /> Return
          </button>
        </div>

        {/* Book Title */}
        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: '700',
          color: 'var(--text-main)',
          lineHeight: '1.4',
          marginBottom: '0.5rem'
        }}>
          {book.title}
        </h3>

        {/* Borrower Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          <User size={15} color="var(--accent-primary)" />
          <span>Borrower: <strong style={{ color: 'var(--text-main)' }}>{book.borrowerName}</strong></span>
        </div>
      </div>

      {/* Middle Meta Info */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.25)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={14} /> Checkout Date:
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--text-main)' }}>
            {book.checkoutDate}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={14} /> Due Date (7 Days):
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: '700',
            color: isRed ? '#f87171' : isYellow ? '#fbbf24' : '#34d399'
          }}>
            {book.dueDate}
          </span>
        </div>
      </div>

      {/* Bottom Penalty / Status Highlight Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.5rem',
        borderTop: '1px solid var(--border-color)'
      }}>
        {isRed ? (
          <>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700', color: '#f87171', letterSpacing: '0.04em' }}>
                Server Late Penalty
              </span>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f87171', fontFamily: 'var(--font-mono)' }}>
                ${book.penalty.toFixed(2)}
                {book.breakdown?.isCapped && (
                  <span style={{ fontSize: '0.7rem', color: '#fca5a5', marginLeft: '0.4rem', fontWeight: '600' }}>
                    (MAX CAP)
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => onSelectBreakdown(book)}
              className="penalty-pill"
              title="Click to view backend calculation tier breakdown"
            >
              <Info size={14} /> Fee Info
            </button>
          </>
        ) : isYellow ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontSize: '0.85rem', fontWeight: '600' }}>
            <AlertCircle size={16} /> Due tomorrow! No penalty yet ($0.00)
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontSize: '0.85rem', fontWeight: '600' }}>
            <CheckCircle size={16} /> Safe ({book.daysRemaining} days left) • $0.00 Fee
          </div>
        )}
      </div>

    </div>
  );
}
