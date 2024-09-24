import React from 'react';
import './Styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <MountainIcon />
      <p id='brief'>
        Anonymously share college experiences, reviews, discussions. Upvote, downvote,
        search, and verify email domains for genuine users.
      </p>
      <nav>
        <div>
          <ul>
            <li><a href="#">Terms</a></li> 
            <li><a href="#">Privacy</a></li> 
            <li><a href="#">Compliance</a></li> 
            <li><a href="#">Contact</a></li> 
          </ul>
        </div>
      </nav>
      <p className='email'>AnonymS@gmail.com</p>
      <p>© 2024 AnonymS Inc. All rights reserved.</p>
    </footer>
  );
}

function MountainIcon(props) {
  return (
    <svg
      data-testid="mountain-icon" // Add data-testid for testing
      width="24"
      height="24"
      fill=""
      stroke="currentColor"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

export default Footer;
