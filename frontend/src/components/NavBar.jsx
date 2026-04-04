import { NavLink } from 'react-router-dom';

const links = [
  { to: '/stats', label: 'Stats' },
  { to: '/beers', label: 'Beers' },
  { to: '/breweries', label: 'Breweries' },
  { to: '/styles', label: 'Styles' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/consumption', label: 'Log' },
];

export default function NavBar({ theme, onToggleTheme }) {
  return (
    <nav style={{ background: 'var(--nav-bg)', padding: '0.75rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', borderBottom: '1px solid var(--border-soft)', flexWrap: 'wrap' }}>
      <strong style={{ color: 'var(--accent)', marginRight: 'auto', fontSize: '1.1rem' }}>🍺 Beer Tracker</strong>
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          style={({ isActive }) => ({
            color: isActive ? 'var(--accent)' : 'var(--text-muted)',
            textDecoration: 'none',
            fontWeight: isActive ? 'bold' : 'normal',
          })}
        >
          {label}
        </NavLink>
      ))}
      <button
        type="button"
        onClick={() => onToggleTheme?.()}
        style={{ whiteSpace: 'nowrap' }}
      >
        {theme === 'night' ? 'Day Theme' : 'Night Theme'}
      </button>
    </nav>
  );
}
