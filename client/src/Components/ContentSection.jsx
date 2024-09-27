// ContentSection.jsx
import React from 'react';
import './Styles/ContentSection.css';

const ContentSection = () => {
  return (
    <div className="content-section">
      <section className="about-section">
        <h1>AnonymX</h1>
        <p>
          AnonymX is an online platform aimed at facilitating anonymous posting for college reviews and related discussions.
          It provides a safe space for students to share their experiences, insights, and advice about colleges and universities worldwide.
          The platform allows users to post anonymously to encourage honesty and transparency.
        </p>
      </section>

      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature">
            <h3>Anonymous Posting</h3>
            <p>Users can submit posts without revealing their identity, promoting open and honest sharing of experiences.</p>
          </div>
          <div className="feature">
            <h3>College Reviews</h3>
            <p>Users can write reviews of colleges they have attended or have knowledge about, covering aspects like academics, campus life, and more.</p>
          </div>
          <div className="feature">
            <h3>Discussion Threads</h3>
            <p>Users can engage in conversations by asking questions and seeking advice related to specific colleges.</p>
          </div>
          <div className="feature">
            <h3>Like and Unlike</h3>
            <p>Users can like or unlike posts to help surface the most relevant content.</p>
          </div>
          <div className="feature">
            <h3>Search and Filtering</h3>
            <p>Users can search for colleges and filter posts based on location, programs, or topics.</p>
          </div>
          <div className="feature">
            <h3>Email Domain Verification</h3>
            <p>Users must verify their email domains to ensure they are affiliated with the colleges they claim.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContentSection;