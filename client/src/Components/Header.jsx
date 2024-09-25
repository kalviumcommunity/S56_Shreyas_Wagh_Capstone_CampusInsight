// Header.jsx
import React from 'react';
import './Styles/Header.css';
import { Link } from 'react-router-dom';
import MountainIcon from './MountainIcon';

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">
        <MountainIcon />
        <span className="visually-hidden">AnonymX</span>
      </div>
      <nav className="header-nav">
        <Link to="/">Home</Link>
        <Link to="/aboutus">About</Link>
        <Link to="/features">Features</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <div className="header-get-started">
        <Link to="/signup" className="get-started-btn">Get Started</Link>
      </div>
    </header>
  );
};

export default Header;
