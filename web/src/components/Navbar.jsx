import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <h2>JobFair</h2>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <a href="#home" className="navbar-link">Home</a>
          <a href="#about" className="navbar-link">About</a>
          <a href="#jobs" className="navbar-link">Jobs</a>
          <a href="#companies" className="navbar-link">Companies</a>
          <a href="#contact" className="navbar-link">Contact</a>
        </div>

        <div className="navbar-actions">
          <button className="btn btn-secondary">Sign In</button>
          <button className="btn btn-primary">Sign Up</button>
        </div>

        <div className="navbar-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
}