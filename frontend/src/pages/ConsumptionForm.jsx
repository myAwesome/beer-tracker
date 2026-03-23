import { useState } from 'react';
import { createConsumption } from '../api';

export default function ConsumptionForm({ beers, onSave, onCancel }) {
  const [form, setForm] = useState({
    beer_id: '',
    rating: 3,
    notes: '',
    consumed_at: new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createConsumption({
        ...form,
        beer_id: parseInt(form.beer_id),
        rating: parseFloat(form.rating),
      });
      onSave();
    } catch (err) {
      setError(err.message);
    }
  };

  const inputStyle = { display: 'block', width: '100%', padding: '0.35rem', boxSizing: 'border-box' };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: 8, background: '#f9f9f9' }}
    >
      <h3 style={{ marginTop: 0 }}>Log a Drink</h3>
      {error && <p style={{ color: 'red', margin: '0 0 0.5rem' }}>{error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <label style={{ gridColumn: '1 / -1', fontSize: '0.9rem' }}>
          Beer *
          <select value={form.beer_id} onChange={set('beer_id')} required style={inputStyle}>
            <option value="">-- select beer --</option>
            {beers.map((b) => (
              <option key={b.id} value={b.id}>{b.name} — {b.brewery}</option>
            ))}
          </select>
        </label>
        <label style={{ fontSize: '0.9rem' }}>
          Date
          <input type="date" value={form.consumed_at} onChange={set('consumed_at')} style={inputStyle} />
        </label>
        <label style={{ fontSize: '0.9rem' }}>
          Rating: {'★'.repeat(Math.round(parseFloat(form.rating)))}{'☆'.repeat(5 - Math.round(parseFloat(form.rating)))} ({form.rating}/5)
          <input type="range" min="1" max="5" step="0.1" value={form.rating} onChange={set('rating')} style={{ display: 'block', width: '100%' }} />
        </label>
        <label style={{ gridColumn: '1 / -1', fontSize: '0.9rem' }}>
          Notes
          <input type="text" value={form.notes} onChange={set('notes')} placeholder="Optional notes..." style={inputStyle} />
        </label>
      </div>
      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
        <button type="submit">Log Drink</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
