import { NavLink } from 'react-router-dom';

const links = [
  { to: '/stats', label: 'Stats' },
  { to: '/beers', label: 'Beers' },
  { to: '/breweries', label: 'Breweries' },
  { to: '/styles', label: 'Styles' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/consumption', label: 'Log' },
];

export default function NavBar() {
  return (
    <nav style={{ background: '#2c2c2c', padding: '0.75rem 1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <strong style={{ color: '#f5a623', marginRight: 'auto', fontSize: '1.1rem' }}>🍺 Beer Tracker</strong>
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          style={({ isActive }) => ({
            color: isActive ? '#f5a623' : '#ccc',
            textDecoration: 'none',
            fontWeight: isActive ? 'bold' : 'normal',
          })}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
