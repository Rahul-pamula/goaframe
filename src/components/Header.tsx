import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

export const Header: React.FC = () => {
  return (
    <header className="site-header glass-panel">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <span className="text-headline-sm tracking-tight text-on-surface">FrameInGoa</span>
        </Link>
        <nav className="header-nav hidden-mobile">
          <NavLink to="/" className={({isActive}) => `nav-link text-body-md ${isActive ? 'active' : ''}`} end>Home</NavLink>
          <NavLink to="/gallery" className={({isActive}) => `nav-link text-body-md ${isActive ? 'active' : ''}`}>Gallery</NavLink>
          <NavLink to="/about" className={({isActive}) => `nav-link text-body-md ${isActive ? 'active' : ''}`}>About HH Goa 2026</NavLink>
        </nav>
        <div className="header-actions">
          <Link to="/identity" className="btn btn-primary text-label-caps hidden-mobile">
            CREATE FRAME
          </Link>
          <button className="menu-btn mobile-only">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
};
