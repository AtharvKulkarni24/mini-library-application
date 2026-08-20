import React from 'react';
import { X, Calculator, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export default function PenaltyBreakdownModal({ book, onClose }) {
  if (!book || !book.breakdown) return null;

  const { breakdown } = book;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '2rem', border: '1px solid var(--status-red-border)' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'rgba(239, 68, 68, 0.2)',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calculator size={20} color="#f87171" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Server Penalty Calculation Audit
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Rule-by-rule breakdown for "{book.title}"
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Timeline Metadata */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '1.25rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '0.5rem',
          fontSize: '0.82rem',
          textAlign: 'center'
        }}>
          <div>
            <span style={{ color: 'var(--text-dim)', display: 'block' }}>Checkout</span>
            <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>{book.checkoutDate}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-dim)', display: 'block' }}>Due Date</span>
            <strong style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{book.dueDate}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-dim)', display: 'block' }}>Evaluation</span>
            <strong style={{ color: '#f87171', fontFamily: 'var(--font-mono)' }}>{book.daysOverdue} Days Overdue</strong>
          </div>
        </div>

        {/* Tier Calculation Breakdown Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          
          {/* Tier 1 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#fbbf24' }}>
                Tier 1 Penalty (Days 1 to 3)
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {breakdown.tier1Days} {breakdown.tier1Days === 1 ? 'day' : 'days'} overdue @ $1.00 / day
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '1rem', color: '#fbbf24' }}>
              +${breakdown.tier1Fee.toFixed(2)}
            </div>
          </div>

          {/* Tier 2 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#f87171' }}>
                Tier 2 Penalty (Days 4+)
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {breakdown.tier2Days} {breakdown.tier2Days === 1 ? 'day' : 'days'} overdue @ $2.00 / day
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '1rem', color: '#f87171' }}>
              +${breakdown.tier2Fee.toFixed(2)}
            </div>
          </div>

          {/* Capping Rule */}
          <div style={{
            background: breakdown.isCapped ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.08)',
            border: breakdown.isCapped ? '1px dashed #f87171' : '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {breakdown.isCapped ? <AlertCircle size={18} color="#f87171" /> : <ShieldCheck size={18} color="#34d399" />}
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.88rem', color: breakdown.isCapped ? '#f87171' : '#34d399' }}>
                  {breakdown.isCapped ? 'Maximum Cap Reached ($15 Limit)' : 'Under Maximum Cap ($15)'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Uncapped Raw Total: ${breakdown.rawPenalty.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Final Penalty Summary */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(99, 102, 241, 0.2))',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>
            Final Server Calculated Late Fee:
          </span>
          <span style={{ fontSize: '1.6rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#f87171' }}>
            ${book.penalty.toFixed(2)}
          </span>
        </div>

        <button className="btn-secondary" onClick={onClose} style={{ width: '100%', marginTop: '1.25rem', justifyContent: 'center' }}>
          Close Breakdown
        </button>

      </div>
    </div>
  );
}
