import { useEffect, useState } from 'react';
import { getStyles, deleteStyle } from '../api';
import StyleForm from './StyleForm';

export default function StylesPage() {
  const [styles, setStyles] = useState([]);
  const [editing, setEditing] = useState(undefined); // undefined=hidden, null=new, obj=edit
  const [search, setSearch] = useState('');

  const load = () => getStyles(search).then(setStyles);

  useEffect(() => { load(); }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this style?')) return;
    await deleteStyle(id);
    load();
  };

  const thStyle = { padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid var(--border)', whiteSpace: 'nowrap' };
  const tdStyle = { padding: '0.5rem', borderBottom: '1px solid var(--border-soft)' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h2 style={{ margin: 0 }}>Styles</h2>
        <button onClick={() => setEditing(null)}>+ Add Style</button>
      </div>

      <input
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
      />

      {editing !== undefined && (
        <StyleForm
          style={editing}
          onSave={() => { setEditing(undefined); load(); }}
          onCancel={() => setEditing(undefined)}
        />
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--surface-muted)' }}>
            <th style={thStyle}>Name</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {styles.length === 0 && (
            <tr><td colSpan={2} style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'center' }}>No styles yet. Add one!</td></tr>
          )}
          {styles.map((s) => (
            <tr key={s.id}>
              <td style={tdStyle}><strong>{s.name}</strong></td>
              <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                <button onClick={() => setEditing(s)} style={{ marginRight: '0.25rem' }}>Edit</button>
                <button onClick={() => handleDelete(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
