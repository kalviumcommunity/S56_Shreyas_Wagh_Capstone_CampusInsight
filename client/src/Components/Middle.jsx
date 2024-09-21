import React, { useState, useEffect } from 'react';
import './Styles/Middle.css';
import moment from 'moment-timezone';
import axios from 'axios';
import MessageInput from './MessageInput';
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { CiBookmark, CiBookmarkCheck } from "react-icons/ci";

const Middle = ({ messages }) => {
  const getUserTimezone = () => {
    return 'Asia/Kolkata'; 
  };
  const userTimezone = getUserTimezone();

  const [updatedMessages, setUpdatedMessages] = useState(messages);
  const [likedMessages, setLikedMessages] = useState([]);
  const [bookmarkedMessages, setBookmarkedMessages] = useState([]);
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

    const fetchLikedMessages = async (username) => {
      try {
        const response = await axios.get(`https://s56-shreyas-wagh-capstone-campusinsight.onrender.com/likedMessages?username=${username}`);
        setLikedMessages(response.data.likedMessages);
      } catch (error) {
        console.error('Error fetching liked messages:', error);
      }
    };

    const fetchBookmarkedMessages = async (username) => {
      try {
        const response = await axios.get(`http://localhost:3000/bookmarkedMessages?username=${username}`);
        setBookmarkedMessages(response.data.bookmarkedMessages);
      } catch (error) {
        console.error('Error fetching bookmarked messages:', error);
      }
    };

    fetchUsername();
    if (username) {
      fetchLikedMessages(username);
      fetchBookmarkedMessages(username);
    }
  }, [username]);

  const handleLike = async (messageId) => {
    try {
      if (!likedMessages.includes(messageId)) {
        await axios.post('https://s56-shreyas-wagh-capstone-campusinsight.onrender.com/likeMessage', { messageId, username });
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
        await axios.post('https://s56-shreyas-wagh-capstone-campusinsight.onrender.com/unlikeMessage', { messageId, username });
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

  const handleBookmark = async (messageId) => {
    try {
      if (!bookmarkedMessages.includes(messageId)) {
        await axios.post('http://localhost:3000/bookmarkMessage', { messageId, username });
        setBookmarkedMessages([...bookmarkedMessages, messageId]);
      }
    } catch (error) {
      console.error('Error bookmarking message:', error);
    }
  };

  const handleUnbookmark = async (messageId) => {
    try {
      if (bookmarkedMessages.includes(messageId)) {
        await axios.post('http://localhost:3000/unbookmarkMessage', { messageId, username });
        setBookmarkedMessages(bookmarkedMessages.filter(id => id !== messageId));
      }
    } catch (error) {
      console.error('Error unbookmarking message:', error);
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
                <button onClick={() => handleLike(message._id)}><CiHeart /></button>
              ) : (
                <button onClick={() => handleUnlike(message._id)}><FaHeart /></button>
              )}
              {!bookmarkedMessages.includes(message._id) ? (
                <button onClick={() => handleBookmark(message._id)}><CiBookmark /></button>
              ) : (
                <button onClick={() => handleUnbookmark(message._id)}><CiBookmarkCheck /></button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Middle;