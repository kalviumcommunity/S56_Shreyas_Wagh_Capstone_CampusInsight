import React from 'react';
import './Styles/Middle.css';
import moment from 'moment-timezone';

const Middle = ({ messages }) => {
  const getUserTimezone = () => {
    return 'Asia/Kolkata'; 
  };
  const userTimezone = getUserTimezone();

  return (
    <div className="message-feed">
      <div className="feed">
        {messages.map((message) => (
          <div className="message" key={message._id}>
            <div className="user-info">
              <span className="username">{message.username}</span>
            </div>
            <div className="content">
              <p>{message.message}</p>
            </div>
            <div className="metadata">
              <span className="timestamp">{moment(message.timestamp).tz(userTimezone).format('YYYY-MM-DD HH:mm:ss')}</span>
              <span className="likes">{message.likes} Likes</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Middle;
