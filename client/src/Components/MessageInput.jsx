import React, { useState } from 'react';
import axios from 'axios';
import './Styles/MessageInput.css';

const MessageInput = ({ onNewMessage, username }) => {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null); // State for storing the uploaded image

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !image) return; // Ensure there's either a message or an image

    const formData = new FormData(); // Create a new FormData object to hold the data
    formData.append('message', message); // Append the message text
    formData.append('username', username); // Append the username
    if (image) {
      formData.append('image', image); // Append the image file if uploaded
    }

    try {
      const response = await axios.post('http://localhost:3000/postMessage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type for file upload
        },
      });
      setMessage(''); // Clear the message input
      setImage(null); // Clear the image input
      if (onNewMessage) {
        onNewMessage(response.data); // Optionally trigger any callback after successful post
      }
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Update image state when a file is selected
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
