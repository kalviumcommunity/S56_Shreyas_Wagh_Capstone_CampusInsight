import React, { useState } from 'react';
import axios from 'axios';
import './Styles/MessageInput.css';

const MessageInput = ({ onNewMessage, username }) => {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !image) return;

    const formData = new FormData(); 
    formData.append('message', message); 
    formData.append('username', username); 
    if (image) {
      formData.append('image', image); 
    }

    try {
      const response = await axios.post('http://localhost:3000/postMessage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
      setMessage('');
      setImage(null); 
      if (onNewMessage) {
        onNewMessage(response.data); 
      }
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); 
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="What's happening?"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      <button type="submit">Post</button>
    </form>
  );
};

export default MessageInput;
