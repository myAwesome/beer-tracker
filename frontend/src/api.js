const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  if (res.status === 204) return null;
  return res.json();
}

// Beers
export const getBeers = (q) => request(`/api/beers${q ? `?q=${encodeURIComponent(q)}` : ''}`);
export const getBeer = (id) => request(`/api/beers/${id}`);
export const createBeer = (data) => request('/api/beers', { method: 'POST', body: JSON.stringify(data) });
export const updateBeer = (id, data) => request(`/api/beers/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteBeer = (id) => request(`/api/beers/${id}`, { method: 'DELETE' });

// Inventory
export const getInventory = (beerID) => request(`/api/inventory${beerID ? `?beer_id=${beerID}` : ''}`);
export const createInventory = (data) => request('/api/inventory', { method: 'POST', body: JSON.stringify(data) });
export const updateInventory = (id, data) => request(`/api/inventory/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteInventory = (id) => request(`/api/inventory/${id}`, { method: 'DELETE' });

// Consumption
export const getConsumption = (beerID) => request(`/api/consumption${beerID ? `?beer_id=${beerID}` : ''}`);
export const createConsumption = (data) => request('/api/consumption', { method: 'POST', body: JSON.stringify(data) });
export const deleteConsumption = (id) => request(`/api/consumption/${id}`, { method: 'DELETE' });

// Stats
export const getStats = () => request('/api/stats');
