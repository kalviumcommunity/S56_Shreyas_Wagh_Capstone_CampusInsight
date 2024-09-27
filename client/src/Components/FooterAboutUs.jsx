import React from 'react';
import './Styles/FooterAboutUs.css';
import MountainIcon from './MountainIcon';
const Footer = () => {
  return (
    <footer className="footer">
        <MountainIcon />
      <p>
        Anonymously share college experiences, reviews, and discussions. Upvote, downvote, search, and verify email domains for genuine users.
      </p>
      <div className="footer-links">
        
        <span>Terms</span>
        <span>Privacy</span>
        <span>Compliance</span>
        <span>Contact</span>
      </div>
    </footer>
  );
};

export default Footer;