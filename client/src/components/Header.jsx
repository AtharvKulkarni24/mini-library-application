import React from 'react';
import { BookOpen, Plus, Calendar, RotateCcw } from 'lucide-react';

export default function Header({ 
  simulatedDate, 
  onSimulatedDateChange, 
  onResetDate, 
  onOpenAddModal 
}) {
  return (
    <header className="glass-panel" style={{ padding: '1.25rem 1.75rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)'
          }}>
            <BookOpen size={26} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              LibroPulse
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>
              Mini Library Borrowing & Server-Side Penalty Dashboard
            </p>
          </div>
        </div>

        {/* Action Controls: Simulated Date & Add Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          
          {/* Date Simulation Tool */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-color)',
            padding: '0.4rem 0.8rem',
            borderRadius: 'var(--radius-md)'
          }}>
            <Calendar size={16} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              Simulated Date:
            </span>
            <input
              type="date"
              value={simulatedDate}
              onChange={(e) => onSimulatedDateChange(e.target.value)}
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                padding: '0.25rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-mono)',
                outline: 'none'
              }}
            />
            {simulatedDate && (
              <button
                onClick={onResetDate}
                title="Reset to today"
                className="btn-secondary"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', height: '28px' }}
              >
                <RotateCcw size={13} /> Today
              </button>
            )}
          </div>

          {/* Add Book Button */}
          <button className="btn-primary" onClick={onOpenAddModal}>
            <Plus size={18} />
            Borrow Book
          </button>
        </div>

      </div>
    </header>
  );
}
