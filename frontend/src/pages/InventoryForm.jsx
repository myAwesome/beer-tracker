import { useState } from 'react';
import { createInventory, updateInventory } from '../api';

export default function InventoryForm({ item, beers, onSave, onCancel }) {
  const [form, setForm] = useState({
    beer_id: item?.beer_id || '',
    quantity: item?.quantity || 1,
    purchase_date: item?.purchase_date ? item.purchase_date.split('T')[0] : '',
    price_per_unit: item?.price_per_unit || '',
    notes: item?.notes || '',
  });
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      beer_id: parseInt(form.beer_id),
      quantity: parseInt(form.quantity),
      price_per_unit: parseFloat(form.price_per_unit) || 0,
    };
    try {
      item ? await updateInventory(item.id, payload) : await createInventory(payload);
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
      <h3 style={{ marginTop: 0 }}>{item ? 'Edit Entry' : 'Add Stock'}</h3>
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
        {[
          { label: 'Quantity *', key: 'quantity', type: 'number', min: 1, required: true },
          { label: 'Price Per Unit', key: 'price_per_unit', type: 'number', step: '0.01' },
          { label: 'Purchase Date', key: 'purchase_date', type: 'date' },
          { label: 'Notes', key: 'notes', type: 'text' },
        ].map(({ label, key, ...rest }) => (
          <label key={key} style={{ fontSize: '0.9rem' }}>
            {label}
            <input value={form[key]} onChange={set(key)} style={inputStyle} {...rest} />
          </label>
        ))}
      </div>
      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
        <button type="submit">{item ? 'Save' : 'Add'}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
