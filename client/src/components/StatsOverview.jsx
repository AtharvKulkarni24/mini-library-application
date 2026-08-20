import React from 'react';
import { Book, CheckCircle2, AlertTriangle, AlertCircle, DollarSign } from 'lucide-react';

export default function StatsOverview({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      title: 'Total Borrowed',
      value: stats.totalBooks || 0,
      icon: Book,
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.1)',
      border: 'rgba(56, 189, 248, 0.2)'
    },
    {
      title: 'Safe (Not Due Yet)',
      value: stats.safeCount || 0,
      icon: CheckCircle2,
      color: '#34d399',
      bg: 'rgba(52, 211, 153, 0.1)',
      border: 'rgba(52, 211, 153, 0.2)'
    },
    {
      title: 'Due Tomorrow',
      value: stats.dueTomorrowCount || 0,
      icon: AlertTriangle,
      color: '#fbbf24',
      bg: 'rgba(251, 191, 36, 0.1)',
      border: 'rgba(251, 191, 36, 0.2)'
    },
    {
      title: 'Overdue Books',
      value: stats.overdueCount || 0,
      icon: AlertCircle,
      color: '#f87171',
      bg: 'rgba(248, 113, 113, 0.1)',
      border: 'rgba(248, 113, 113, 0.2)'
    },
    {
      title: 'Total Fees Owed',
      value: `$${stats.totalPenalties || 0}`,
      icon: DollarSign,
      color: '#c084fc',
      bg: 'rgba(192, 132, 252, 0.1)',
      border: 'rgba(192, 132, 252, 0.2)'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.25rem',
      marginBottom: '2rem'
    }}>
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className="glass-panel"
            style={{
              padding: '1.25rem',
              background: card.bg,
              borderColor: card.border,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                {card.title}
              </p>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: card.color }}>
                {card.value}
              </h2>
            </div>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(0, 0, 0, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <IconComponent size={22} color={card.color} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
