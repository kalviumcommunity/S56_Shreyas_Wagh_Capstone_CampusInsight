import React, { useState, useEffect } from 'react';
import './Styles/Middle.css';
import moment from 'moment-timezone';
import axios from 'axios';

const Middle = ({ messages }) => {
  const getUserTimezone = () => {
    return 'Asia/Kolkata'; 
  };
  const userTimezone = getUserTimezone();

  const [updatedMessages, setUpdatedMessages] = useState(messages);
  const [likedMessages, setLikedMessages] = useState([]);

  useEffect(() => {
    setUpdatedMessages(messages); 
  }, [messages]);

  const handleLike = async (messageId) => {
    try {
      if (!likedMessages.includes(messageId)) {
        await axios.post('http://localhost:3000/likeMessage', { messageId });
        setLikedMessages([...likedMessages, messageId]);
        setUpdatedMessages(prevMessages =>
          prevMessages.map(msg =>
            msg._id === messageId ? { ...msg, likes: msg.likes + 1 } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error liking message:', error);
    }
  };

  const handleUnlike = async (messageId) => {
    try {
      if (likedMessages.includes(messageId)) {
        await axios.post('http://localhost:3000/unlikeMessage', { messageId });
        setLikedMessages(likedMessages.filter(id => id !== messageId));
        setUpdatedMessages(prevMessages =>
          prevMessages.map(msg =>
            msg._id === messageId ? { ...msg, likes: Math.max(0, msg.likes - 1) } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error unliking message:', error);
    }
  };

  return (
    <div className="message-feed">
      <div className="feed">
        {updatedMessages.map((message) => (
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
              {!likedMessages.includes(message._id) ? (
                <button onClick={() => handleLike(message._id)}>Like</button>
              ) : (
                <button onClick={() => handleUnlike(message._id)}>Unlike</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Middle;
