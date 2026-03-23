import { useEffect, useState } from 'react';
import { getConsumption, getBeers, deleteConsumption } from '../api';
import ConsumptionForm from './ConsumptionForm';

export default function ConsumptionPage() {
  const [logs, setLogs] = useState([]);
  const [beers, setBeers] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const load = () =>
    Promise.all([getConsumption(), getBeers()]).then(([c, b]) => {
      setLogs(c);
      setBeers(b);
    });

  useEffect(() => { load(); }, []);

  const thStyle = { padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #ddd', whiteSpace: 'nowrap' };
  const tdStyle = { padding: '0.5rem', borderBottom: '1px solid #f0f0f0' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h2 style={{ margin: 0 }}>Consumption Log</h2>
        <button onClick={() => setShowForm(true)}>+ Log a Drink</button>
      </div>

      {showForm && (
        <ConsumptionForm
          beers={beers}
          onSave={() => { setShowForm(false); load(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={thStyle}>Beer</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Amount</th>
            <th style={thStyle}>Units</th>
            <th style={thStyle}>Rating</th>
            <th style={thStyle}>Notes</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 && (
            <tr><td colSpan={7} style={{ padding: '1rem', color: '#999', textAlign: 'center' }}>No drinks logged yet.</td></tr>
          )}
          {logs.map((log) => (
            <tr key={log.id}>
              <td style={tdStyle}>{log.beer?.name ?? `Beer #${log.beer_id}`}</td>
              <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{new Date(log.consumed_at + 'T00:00:00').toLocaleDateString()}</td>
              <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{log.amount ? `${log.amount} ml` : '—'}</td>
              <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{log.alcohol_units ? log.alcohol_units.toFixed(2) : '—'}</td>
              <td style={tdStyle}>
                <span style={{ color: '#f5a623' }}>{'★'.repeat(Math.round(log.rating))}</span>
                <span style={{ color: '#ccc' }}>{'★'.repeat(5 - Math.round(log.rating))}</span>
                <span style={{ color: '#666', marginLeft: '0.25rem', fontSize: '0.85rem' }}>{log.rating}</span>
              </td>
              <td style={tdStyle}>{log.notes || '—'}</td>
              <td style={tdStyle}>
                <button
                  onClick={async () => {
                    if (window.confirm('Delete this log entry?')) {
                      await deleteConsumption(log.id);
                      load();
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
