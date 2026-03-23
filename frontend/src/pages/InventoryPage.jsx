import { useEffect, useState } from 'react';
import { getInventory, getBeers, deleteInventory } from '../api';
import InventoryForm from './InventoryForm';

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [beers, setBeers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const load = () =>
    Promise.all([getInventory(), getBeers()]).then(([inv, b]) => {
      setItems(inv);
      setBeers(b);
    });

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditItem(null); setShowForm(true); };
  const openEdit = (item) => { setEditItem(item); setShowForm(true); };
  const closeForm = () => setShowForm(false);

  const totalStock = items.reduce((sum, i) => sum + i.quantity, 0);

  const thStyle = { padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #ddd', whiteSpace: 'nowrap' };
  const tdStyle = { padding: '0.5rem', borderBottom: '1px solid #f0f0f0' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h2 style={{ margin: 0 }}>
          Inventory{' '}
          <span style={{ fontSize: '1rem', color: '#666', fontWeight: 'normal' }}>({totalStock} units in stock)</span>
        </h2>
        <button onClick={openCreate}>+ Add Stock</button>
      </div>

      {showForm && (
        <InventoryForm
          item={editItem}
          beers={beers}
          onSave={() => { closeForm(); load(); }}
          onCancel={closeForm}
        />
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={thStyle}>Beer</th>
            <th style={thStyle}>Qty</th>
            <th style={thStyle}>Purchased</th>
            <th style={thStyle}>Price/unit</th>
            <th style={thStyle}>Notes</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr><td colSpan={6} style={{ padding: '1rem', color: '#999', textAlign: 'center' }}>No inventory yet.</td></tr>
          )}
          {items.map((item) => (
            <tr key={item.id}>
              <td style={tdStyle}>{item.beer?.name ?? `Beer #${item.beer_id}`}</td>
              <td style={tdStyle}>{item.quantity}</td>
              <td style={tdStyle}>
                {item.purchase_date ? new Date(item.purchase_date).toLocaleDateString() : '—'}
              </td>
              <td style={tdStyle}>
                {item.price_per_unit ? `$${item.price_per_unit.toFixed(2)}` : '—'}
              </td>
              <td style={tdStyle}>{item.notes || '—'}</td>
              <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                <button onClick={() => openEdit(item)} style={{ marginRight: '0.25rem' }}>Edit</button>
                <button onClick={async () => { await deleteInventory(item.id); load(); }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
