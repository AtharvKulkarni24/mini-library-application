import React from 'react';
import { ShieldAlert, Info, Clock, DollarSign } from 'lucide-react';

export default function PenaltyRuleBanner() {
  return (
    <div className="glass-panel" style={{
      padding: '1rem 1.5rem',
      marginBottom: '2rem',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(239, 68, 68, 0.05))',
      borderLeft: '4px solid var(--accent-primary)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldAlert size={22} color="var(--accent-primary)" />
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>
              Server-Side Penalty Tier Policy
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Standard 7-day borrowing period per book. Overdue fees are computed strictly on the backend.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
            <Clock size={15} color="#38bdf8" />
            <span style={{ color: 'var(--text-muted)' }}>Standard Period:</span>
            <strong style={{ color: '#ffffff' }}>7 Days</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
            <DollarSign size={15} color="#fbbf24" />
            <span style={{ color: 'var(--text-muted)' }}>Days 1–3 Overdue:</span>
            <strong style={{ color: '#fbbf24' }}>$1 / day</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
            <DollarSign size={15} color="#f87171" />
            <span style={{ color: 'var(--text-muted)' }}>Days 4+ Overdue:</span>
            <strong style={{ color: '#f87171' }}>$2 / day</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', background: 'rgba(239, 68, 68, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
            <span style={{ color: '#fca5a5', fontWeight: '700' }}>Max Cap: $15 / book</span>
          </div>
        </div>
      </div>
    </div>
  );
}
