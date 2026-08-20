import React from 'react';

export default function PenaltyRuleBanner() {
  return (
    <div className="rule-banner">
      <h3>Library Borrowing & Late Fee Rules</h3>
      <ul>
        <li><strong>Standard Borrowing Period:</strong> 7 Days</li>
        <li><strong>Days 1–3 Overdue:</strong> $1.00 / day</li>
        <li><strong>Days 4+ Overdue:</strong> $2.00 / day</li>
        <li><strong>Maximum Cap:</strong> Capped at $15.00 max per book</li>
      </ul>
    </div>
  );
}
