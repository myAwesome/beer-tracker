import { useState } from 'react';
import { createBrewery, updateBrewery } from '../api';

export default function BreweryForm({ brewery, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: brewery?.name || '',
    country: brewery?.country || '',
    city: brewery?.city || '',
    website: brewery?.website || '',
    description: brewery?.description || '',
    founded_year: brewery?.founded_year || '',
  });

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      founded_year: form.founded_year ? parseInt(form.founded_year) : 0,
    };
    if (brewery?.id) {
      await updateBrewery(brewery.id, data);
    } else {
      await createBrewery(data);
    }
    onSave();
  };

  const inputStyle = { padding: '0.4rem', width: '100%', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', marginBottom: '0.75rem' };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '1rem', marginBottom: '1rem', borderRadius: 4 }}>
      <h3 style={{ margin: '0 0 1rem' }}>{brewery?.id ? 'Edit Brewery' : 'New Brewery'}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
        <label style={labelStyle}>
          Name *<br />
          <input required value={form.name} onChange={set('name')} style={inputStyle} />
        </label>
        <label style={labelStyle}>
          Founded Year<br />
          <input type="number" value={form.founded_year} onChange={set('founded_year')} style={inputStyle} min="1000" max="2100" />
        </label>
        <label style={labelStyle}>
          Country<br />
          <input value={form.country} onChange={set('country')} style={inputStyle} />
        </label>
        <label style={labelStyle}>
          City<br />
          <input value={form.city} onChange={set('city')} style={inputStyle} />
        </label>
        <label style={{ ...labelStyle, gridColumn: '1 / -1' }}>
          Website<br />
          <input value={form.website} onChange={set('website')} style={inputStyle} />
        </label>
        <label style={{ ...labelStyle, gridColumn: '1 / -1' }}>
          Description<br />
          <textarea value={form.description} onChange={set('description')} rows={3} style={inputStyle} />
        </label>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
