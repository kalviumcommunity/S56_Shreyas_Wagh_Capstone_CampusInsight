import React, { useState } from 'react';
import './Styles/Navbar.css';
import MountainIcon from './MountainIcon';
import { Link, useNavigate } from 'react-router-dom';
function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <MountainIcon />
        <span className="visually-hidden">AnonymX</span>
      </div>
      <nav className="navbar-nav">
        <span>Home</span>
        <span>About</span>
        <span>Features</span>
        <span>Blog</span>
        <span>Contact</span>
      </nav>
      <div className="navbar-dropdown">
        <div className="navbar-button-container">
          <button className="navbar-button" onClick={toggleDropdown}>
            Get Started
          </button>
          {isDropdownOpen && (
            <div className="dropdown-content">
              <Link to={"/login"}><span className="navbar-login">Login</span></Link>
               <Link to={"/signup"}><span className="navbar-signup">Signup</span></Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
