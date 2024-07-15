import React, { useState, useEffect } from 'react';
import './Styles/Middle.css';
import moment from 'moment-timezone';
import axios from 'axios';
import MessageInput from './MessageInput';

const Middle = ({ messages }) => {
  const getUserTimezone = () => {
    return 'Asia/Kolkata'; 
  };
  const userTimezone = getUserTimezone();

  const [updatedMessages, setUpdatedMessages] = useState(messages);
  const [likedMessages, setLikedMessages] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    setUpdatedMessages(messages); 
  }, [messages]);

  useEffect(() => {
    const fetchUsername = () => {
      try {
        const usernameCookie = document.cookie.split('; ').find(row => row.startsWith('username='));
        if (usernameCookie) {
          const username = usernameCookie.split('=')[1];
          setUsername(username);
        } else {
          console.warn('Username cookie not found');
        }
      } catch (error) {
        console.error('Error parsing username cookie:', error);
      }
    };

    fetchUsername();
  }, []);

  const handleLike = async (messageId) => {
    try {
      if (!likedMessages.includes(messageId)) {
        await axios.post('https://s56-shreyas-wagh-capstone-campusinsight.onrender.com/likeMessage', { messageId });
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
        await axios.post('https://s56-shreyas-wagh-capstone-campusinsight.onrender.com/unlikeMessage', { messageId });
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

  const handleNewMessage = (newMessage) => {
    setUpdatedMessages([newMessage, ...updatedMessages]);
  };

  return (
    <div className="message-feed">
      <MessageInput onNewMessage={handleNewMessage} username={username} />
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
};

export default Middle;
