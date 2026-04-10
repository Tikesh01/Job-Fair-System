import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { getCookie } from '../utils/cookies';
import api from '../api/axiosapi';
import { useNotification } from '../contexts/NotificationContext';

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/imp-dates', label: 'Dates' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/job', label: 'Jobs' },
  { to: '/company', label: 'Companies' },
];

export default function Navbar() {
  const token = getCookie('token');
  const role = getCookie('role');
  const { notify } = useNotification();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      const response = await api.post('/logout');
      if (response.status === 200) {
        notify('info', 'Log Out Suceess');
        closeMenu();
        navigate('/');
      } else {
        notify('error', response.data?.detail);
      }
    } catch (error) {
      notify('error', error.response?.data?.detail);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-mark">JF</span>
          <div className="logo-copy">
            <span className="logo-title">JobFair</span>
            <span className="logo-subtitle">Career opportunities</span>
          </div>
        </NavLink>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="navbar-links">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? 'navbar-link active' : 'navbar-link'
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="navbar-actions">
            {token && role ? (
              <NavLink to="/dashboard" className="btn-secondary-nav" onClick={closeMenu}>
                Dashboard
              </NavLink>
            ) : (
              <NavLink to="/login" className="btn-secondary-nav" onClick={closeMenu}>
                Login
              </NavLink>
            )}

            {token && role ? (
              <button type="button" className="btn-primary-nav" onClick={handleLogout}>
                Log out
              </button>
            ) : (
              <NavLink to="/signup" className="btn-primary-nav" onClick={closeMenu}>
                Sign Up
              </NavLink>
            )}
          </div>
        </div>

        <button
          type="button"
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
    </nav>
  );
}
