import { NavLink, Outlet } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/courses', label: 'Liste de courses' },
  { to: '/planning', label: 'Planning' },
];

export default function Layout() {
  return (
    <>
      <header className="header">
        <div className="header__inner">
          <NavLink to="/" className="brand">
            Mijoté<span aria-hidden="true">.</span>
          </NavLink>
          <nav className="nav" aria-label="Navigation principale">
            {LINKS.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} className="nav__link">
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
