import React from 'react';

export default function Header({ onSeed, loading }) {
  return (
    <header className="app-header">
      <div className="app-title">
        <h1>Mini Library Dashboard</h1>
        <p>Track borrowed books, due dates, and dynamic late fees</p>
      </div>
      <div className="header-actions">
        <button 
          className="btn btn-outline" 
          onClick={onSeed} 
          disabled={loading}
          title="Seed 5 sample books covering all penalty status states for testing"
        >
          {loading ? 'Seeding...' : '⚡ Seed Demo Data'}
        </button>
      </div>
    </header>
  );
}
