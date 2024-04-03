import React from 'react';
import './Styles/Navbar.css';

function Navbar() {
  return (
    <header className="navbar">
      <a className="navbar-logo" href="#">
        <MountainIcon />
        <span className="sr-only">AnonymS</span>
      </a>
      <nav className="navbar-nav">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Features</a>
        <a href="#">blog</a>
        <a href="#">Contact</a>
      </nav>
      <div>
        <a className="navbar-button" href="#">
          Get Started
        </a>
      </div>
    </header>
  );
}

function MountainIcon(props) {
  return (
    <svg
      width="24"
      height="24"
      fill=""
      stroke="currentColor"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

export default Navbar;
