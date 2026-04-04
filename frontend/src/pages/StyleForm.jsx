import { useState } from 'react';
import { createStyle, updateStyle } from '../api';

export default function StyleForm({ style, onSave, onCancel }) {
  const [name, setName] = useState(style?.name || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      style?.id ? await updateStyle(style.id, { name }) : await createStyle({ name });
      onSave();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: 'var(--surface-muted)', padding: '1rem', marginBottom: '1rem', borderRadius: 4 }}>
      <h3 style={{ margin: '0 0 1rem' }}>{style?.id ? 'Edit Style' : 'New Style'}</h3>
      {error && <p style={{ color: 'var(--danger)', margin: '0 0 0.5rem' }}>{error}</p>}
      <label style={{ display: 'block', marginBottom: '0.75rem' }}>
        Name *<br />
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '0.4rem', width: '100%', boxSizing: 'border-box' }}
        />
      </label>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
