import { useEffect, useState } from 'react';
import { getBeers, deleteBeer } from '../api';
import BeerForm from './BeerForm';

export default function BeersPage() {
  const [beers, setBeers] = useState([]);
  const [editingBeer, setEditingBeer] = useState(undefined); // undefined=hidden, null=new, obj=edit
  const [search, setSearch] = useState('');

  const load = () => getBeers(search).then(setBeers);

  useEffect(() => {
    load();
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this beer?')) return;
    await deleteBeer(id);
    load();
  };

  const thStyle = { padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid var(--border)', whiteSpace: 'nowrap' };
  const tdStyle = { padding: '0.5rem', borderBottom: '1px solid var(--border-soft)' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h2 style={{ margin: 0 }}>Beer Catalog</h2>
        <button onClick={() => setEditingBeer(null)}>+ Add Beer</button>
      </div>

      <input
        placeholder="Search by name or brewery..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
      />

      {editingBeer !== undefined && (
        <BeerForm
          beer={editingBeer}
          onSave={() => { setEditingBeer(undefined); load(); }}
          onCancel={() => setEditingBeer(undefined)}
        />
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--surface-muted)' }}>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Brewery</th>
            <th style={thStyle}>Style</th>
            <th style={thStyle}>ABV</th>
            <th style={thStyle}>IBU</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {beers.length === 0 && (
            <tr><td colSpan={6} style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'center' }}>No beers yet. Add one!</td></tr>
          )}
          {beers.map((b) => (
            <tr key={b.id}>
              <td style={tdStyle}><strong>{b.name}</strong></td>
              <td style={tdStyle}>{b.brewery_obj?.name || b.brewery || '—'}</td>
              <td style={tdStyle}>{b.style || '—'}</td>
              <td style={tdStyle}>{b.abv ? `${b.abv}%` : '—'}</td>
              <td style={tdStyle}>{b.ibu ?? '—'}</td>
              <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                <button onClick={() => setEditingBeer(b)} style={{ marginRight: '0.25rem' }}>Edit</button>
                <button onClick={() => handleDelete(b.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
