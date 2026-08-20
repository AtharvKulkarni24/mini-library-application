import React, { useState } from 'react';
import { X, BookPlus, Sparkles } from 'lucide-react';

export default function BookFormModal({ isOpen, onClose, onSubmit, currentDate }) {
  const [title, setTitle] = useState('');
  const [borrowerName, setBorrowerName] = useState('');
  const [checkoutDate, setCheckoutDate] = useState(
    currentDate || new Date().toISOString().split('T')[0]
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !borrowerName.trim() || !checkoutDate) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onSubmit({ title, borrowerName, checkoutDate });
      // Reset form
      setTitle('');
      setBorrowerName('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add book.');
    } finally {
      setSubmitting(false);
    }
  };

  // Quick preset dates relative to currentDate
  const handleQuickPreset = (offsetDays) => {
    const base = currentDate ? new Date(currentDate) : new Date();
    const target = new Date(base.getTime() - offsetDays * 24 * 60 * 60 * 1000);
    const yyyy = target.getUTCFullYear();
    const mm = String(target.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(target.getUTCDate()).padStart(2, '0');
    setCheckoutDate(`${yyyy}-${mm}-${dd}`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '2rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'rgba(99, 102, 241, 0.2)',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BookPlus size={20} color="var(--accent-primary)" />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Borrow New Book</h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.2rem'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Book Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. JavaScript: The Good Parts"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Borrower Name */}
          <div className="form-group">
            <label className="form-label">Borrower Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Sarah Connor"
              value={borrowerName}
              onChange={(e) => setBorrowerName(e.target.value)}
              required
            />
          </div>

          {/* Checkout Date */}
          <div className="form-group">
            <label className="form-label">Checkout Date *</label>
            <input
              type="date"
              className="form-input"
              value={checkoutDate}
              onChange={(e) => setCheckoutDate(e.target.value)}
              required
            />
          </div>

          {/* Quick preset buttons for easy demo */}
          <div style={{ marginBottom: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '600' }}>
              <Sparkles size={13} color="var(--accent-primary)" /> Quick Test Presets:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                onClick={() => handleQuickPreset(0)}
              >
                🟢 Borrowed Today
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                onClick={() => handleQuickPreset(6)}
              >
                🟡 Due Tomorrow (6 days ago)
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                onClick={() => handleQuickPreset(10)}
              >
                🔴 Overdue 3 days ($3 fee)
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                onClick={() => handleQuickPreset(25)}
              >
                🔴 Max Penalty ($15 Cap)
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Add Book'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
