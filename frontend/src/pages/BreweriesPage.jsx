import { useEffect, useState } from 'react';
import { getBreweries, deleteBrewery } from '../api';
import BreweryForm from './BreweryForm';

export default function BreweriesPage() {
  const [breweries, setBreweries] = useState([]);
  const [editing, setEditing] = useState(undefined); // undefined=hidden, null=new, obj=edit
  const [search, setSearch] = useState('');

  const load = () => getBreweries(search).then(setBreweries);

  useEffect(() => { load(); }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this brewery?')) return;
    await deleteBrewery(id);
    load();
  };

  const thStyle = { padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid var(--border)', whiteSpace: 'nowrap' };
  const tdStyle = { padding: '0.5rem', borderBottom: '1px solid var(--border-soft)' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h2 style={{ margin: 0 }}>Breweries</h2>
        <button onClick={() => setEditing(null)}>+ Add Brewery</button>
      </div>

      <input
        placeholder="Search by name, country or city..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
      />

      {editing !== undefined && (
        <BreweryForm
          brewery={editing}
          onSave={() => { setEditing(undefined); load(); }}
          onCancel={() => setEditing(undefined)}
        />
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--surface-muted)' }}>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Country</th>
            <th style={thStyle}>City</th>
            <th style={thStyle}>Founded</th>
            <th style={thStyle}>Website</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {breweries.length === 0 && (
            <tr><td colSpan={6} style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'center' }}>No breweries yet. Add one!</td></tr>
          )}
          {breweries.map((b) => (
            <tr key={b.id}>
              <td style={tdStyle}><strong>{b.name}</strong></td>
              <td style={tdStyle}>{b.country || '—'}</td>
              <td style={tdStyle}>{b.city || '—'}</td>
              <td style={tdStyle}>{b.founded_year || '—'}</td>
              <td style={tdStyle}>
                {b.website
                  ? <a href={b.website} target="_blank" rel="noreferrer">{b.website}</a>
                  : '—'}
              </td>
              <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                <button onClick={() => setEditing(b)} style={{ marginRight: '0.25rem' }}>Edit</button>
                <button onClick={() => handleDelete(b.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
