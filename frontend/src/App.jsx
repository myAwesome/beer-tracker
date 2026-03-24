import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import StatsPage from './pages/StatsPage';
import BeersPage from './pages/BeersPage';
import InventoryPage from './pages/InventoryPage';
import ConsumptionPage from './pages/ConsumptionPage';
import BreweriesPage from './pages/BreweriesPage';

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/stats" replace />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/beers" element={<BeersPage />} />
          <Route path="/breweries" element={<BreweriesPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/consumption" element={<ConsumptionPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
