import React from 'react';

export default function BookCard({ book }) {
  const { title, description, borrower_name, checkout_date, dueDate, daysOverdue, penalty, status } = book;

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
      </div>
    </div>
  );
}
