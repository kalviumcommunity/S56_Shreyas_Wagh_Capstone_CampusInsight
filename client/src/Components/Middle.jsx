// Middle.js
import React from 'react';
import './Styles/Middle.css';

const Middle = ({ messages }) => {
  return (
    <div className="message-feed">
      <div className="feed">
        {messages.map((message, index) => (
          <div className="message" key={index}>
            <div>
              <div className="user-info">
                <span className="display-name">{message.displayName}</span>
                <span className="username">{message.username}</span>
                <span className="timestamp">{message.timestamp}</span>
              </div>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Middle;
