import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import StatsPage from './pages/StatsPage';
import BeersPage from './pages/BeersPage';
import InventoryPage from './pages/InventoryPage';
import ConsumptionPage from './pages/ConsumptionPage';
import BreweriesPage from './pages/BreweriesPage';
import StylesPage from './pages/StylesPage';

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('beer-tracker-theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'night' ? 'night' : 'light');
    localStorage.setItem('beer-tracker-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <NavBar
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === 'night' ? 'light' : 'night'))}
      />
      <main style={{ maxWidth: 960, margin: '1rem auto', padding: '1rem', background: 'var(--surface)', border: '1px solid var(--border-soft)', borderRadius: 12, boxShadow: 'var(--shadow)' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/stats" replace />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/beers" element={<BeersPage />} />
          <Route path="/breweries" element={<BreweriesPage />} />
          <Route path="/styles" element={<StylesPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/consumption" element={<ConsumptionPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
