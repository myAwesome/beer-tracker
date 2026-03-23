import { useState } from 'react';
import { createBeer, updateBeer } from '../api';

export default function BeerForm({ beer, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: beer?.name || '',
    brewery: beer?.brewery || '',
    style: beer?.style || '',
    abv: beer?.abv ?? '',
    ibu: beer?.ibu ?? '',
    description: beer?.description || '',
    image_url: beer?.image_url || '',
  });
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      abv: parseFloat(form.abv) || 0,
      ibu: form.ibu !== '' ? parseInt(form.ibu) : undefined,
    };
    try {
      beer ? await updateBeer(beer.id, payload) : await createBeer(payload);
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
      <h3 style={{ marginTop: 0 }}>{beer ? 'Edit Beer' : 'Add Beer'}</h3>
      {error && <p style={{ color: 'red', margin: '0 0 0.5rem' }}>{error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {[
          { label: 'Name *', key: 'name', type: 'text', required: true },
          { label: 'Brewery *', key: 'brewery', type: 'text', required: true },
          { label: 'Style', key: 'style', type: 'text' },
          { label: 'ABV (%)', key: 'abv', type: 'number' },
          { label: 'IBU (optional)', key: 'ibu', type: 'number' },
          { label: 'Image URL', key: 'image_url', type: 'text' },
        ].map(({ label, key, type, required }) => (
          <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.9rem' }}>
            {label}
            <input type={type} value={form[key]} onChange={set(key)} required={required} style={inputStyle} />
          </label>
        ))}
        <label style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.9rem' }}>
          Description
          <textarea value={form.description} onChange={set('description')} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
        </label>
      </div>
      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
        <button type="submit">{beer ? 'Save Changes' : 'Create Beer'}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
