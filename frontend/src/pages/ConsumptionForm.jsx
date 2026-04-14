import { useState } from 'react';
import { createConsumption, updateConsumption } from '../api';

export default function ConsumptionForm({ beers, onSave, onCancel, initialData = null }) {
  const isEditing = initialData !== null;

  const [form, setForm] = useState({
    beer_id: initialData?.beer_id?.toString() ?? '',
    amount: initialData?.amount?.toString() ?? 500,
    rating: initialData?.rating?.toString() ?? '4',
    notes: initialData?.notes ?? '',
    consumed_at: initialData?.consumed_at
        ? new Date(initialData.consumed_at).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
  });

  const selectedBeer = beers.find((b) => b.id === parseInt(form.beer_id));
  const alcoholUnits =
      selectedBeer && form.amount > 0
          ? (parseFloat(form.amount) * selectedBeer.abv / 1000).toFixed(2)
          : null;
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        beer_id: parseInt(form.beer_id),
        amount: form.amount ? parseFloat(form.amount) : 0,
        rating: parseFloat(form.rating),
      };
      if (isEditing) {
        await updateConsumption(initialData.id, payload);
      } else {
        await createConsumption(payload);
      }
      onSave();
    } catch (err) {
      setError(err.message);
    }
  };

  const inputStyle = { display: 'block', width: '100%', padding: '0.35rem', boxSizing: 'border-box' };

  return (
      <form
          onSubmit={handleSubmit}
          style={{
            border: '1px solid var(--border)',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: 8,
            background: 'var(--surface-muted)',
          }}
      >
        <h3 style={{ marginTop: 0 }}>{isEditing ? 'Edit Log Entry' : 'Log a Drink'}</h3>
        {error && <p style={{ color: 'var(--danger)', margin: '0 0 0.5rem' }}>{error}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <label style={{ gridColumn: '1 / -1', fontSize: '0.9rem' }}>
            Beer *
            <select value={form.beer_id} onChange={set('beer_id')} required style={inputStyle}>
              <option value="">-- select beer --</option>
              {beers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.brewery_obj.name} - {b.name}
                  </option>
              ))}
            </select>
          </label>
          <label style={{ fontSize: '0.9rem' }}>
            Date
            <input type="date" value={form.consumed_at} onChange={set('consumed_at')} style={inputStyle} />
          </label>
          <label style={{ fontSize: '0.9rem' }}>
            Amount (ml)
            <input
                type="number"
                min="0"
                step="10"
                value={form.amount}
                onChange={set('amount')}
                placeholder="e.g. 500"
                style={inputStyle}
            />
            {alcoholUnits !== null && (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{alcoholUnits} alcohol units</span>
            )}
          </label>
          <label style={{ fontSize: '0.9rem' }}>
            Rating: {'★'.repeat(Math.round(parseFloat(form.rating)))}
            {'☆'.repeat(5 - Math.round(parseFloat(form.rating)))} ({form.rating}/5)
            <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={set('rating')}
                style={{ display: 'block', width: '100%' }}
            />
          </label>
          <label style={{ gridColumn: '1 / -1', fontSize: '0.9rem' }}>
            Notes
            <input
                type="text"
                value={form.notes}
                onChange={set('notes')}
                placeholder="Optional notes..."
                style={inputStyle}
            />
          </label>
        </div>
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
          <button type="submit">{isEditing ? 'Save Changes' : 'Log Drink'}</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
  );
}
