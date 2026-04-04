import { useEffect, useState } from 'react';
import { getStats } from '../api';

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getStats().then(setStats).catch((e) => setError(e.message));
  }, []);

  if (error) return <p style={{ color: 'var(--danger)' }}>{error}</p>;
  if (!stats) return <p>Loading...</p>;

  const cards = [
    { label: 'Beers in Catalog', value: stats.total_beers },
    { label: 'Bottles/Cans in Stock', value: stats.total_inventory },
    { label: 'Total Consumed', value: stats.total_consumed },
    { label: 'Avg Rating', value: stats.average_rating.toFixed(1) },
    { label: 'Breweries', value: stats.unique_breweries },
    { label: 'Favourite Beer', value: stats.top_beer_name || '—' },
  ];

  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {cards.map(({ label, value }) => (
          <div
            key={label}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '1.25rem',
              textAlign: 'center',
              background: 'var(--surface-muted)',
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
