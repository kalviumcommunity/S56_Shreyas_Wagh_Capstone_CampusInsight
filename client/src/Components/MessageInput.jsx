import React, { useState } from 'react';
import axios from 'axios';
import './Styles/MessageInput.css';

const MessageInput = ({ onNewMessage, username }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const response = await axios.post('https://s56-shreyas-wagh-capstone-campusinsight.onrender.com/postMessage', { message, username });
      setMessage('');
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="What's happening?"
      />
      <button type="submit">Post</button>
    </form>
  );
};

export default MessageInput;
