import React, { useEffect, useState } from 'react';
import axios from 'axios';
import cookie from 'js-cookie';
import './Styles/MessagesPage.css';
import Sidebar from '../Components/Sidebar';
import { AiOutlinePaperClip } from 'react-icons/ai'; 

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editedMessage, setEditedMessage] = useState('');
  const [editedImage, setEditedImage] = useState(null);

  const userEmail = cookie.get('userEmail');

  useEffect(() => {
    if (!userEmail) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`https://s56-shreyas-wagh-capstone-campusinsight.onrender.com/userMessages/${userEmail}`);
        setMessages(response.data.messages); 
        setLoading(false);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userEmail]);

  const handleDelete = async (messageId) => {
    try {
      await axios.delete(`https://s56-shreyas-wagh-capstone-campusinsight.onrender.com/deleteMessage/${messageId}`, {
        data: { email: userEmail }, 
      });
      setMessages(messages.filter((message) => message._id !== messageId));
    } catch (err) {
      console.error('Error deleting message:', err);
      setError('Failed to delete message');
    }
  };

  const handleEditClick = (message) => {
    setEditMode(message._id);
    setEditedMessage(message.message);
    setEditedImage(null); 
  };

  const handleEditSubmit = async (messageId) => {
    const formData = new FormData();
    formData.append('message', editedMessage); 
    if (editedImage) {
      formData.append('image', editedImage);
    }
    formData.append('email', userEmail);

    try {
      const response = await axios.put(
        `https://s56-shreyas-wagh-capstone-campusinsight.onrender.com/messages/${messageId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', 
          },
        }
      );
      setMessages(messages.map((msg) => (msg._id === messageId ? response.data : msg)));
      setEditMode(null); 
    } catch (err) {
      console.error('Error updating message:', err);
      setError('Failed to update message');
    }
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditedMessage('');
    setEditedImage(null);
  };

  const handleFileSelect = (e) => {
    setEditedImage(e.target.files[0]);
  };

  const triggerFileInput = () => {
    document.getElementById('fileInput').click();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Sidebar />
      <div className="messages-container">
        <h1>Your Messages</h1>
        {messages.length === 0 ? (
          <p>No messages found.</p>
        ) : (
          messages.map((message) => (
            <div key={message._id} className="message-card">
              {editMode === message._id ? (
                <div className="message-edit-form">
                  <textarea
                    value={editedMessage}
                    onChange={(e) => setEditedMessage(e.target.value)}
                    rows="4"
                    cols="50"
                  />
                  <input
                    id="fileInput"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                  />
                  <br />
                  <button className="file-upload-button" onClick={triggerFileInput}>
                    <AiOutlinePaperClip size={24} />
                  </button>
                  <button onClick={() => handleEditSubmit(message._id)}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </div>
              ) : (
                <>
                  <div className="message-header">
                    <strong>{message.username}</strong>
                  </div>
                  <div className="message-body">
                    <p>{message.message}</p>
                    {message.imageUrl && (
                      <img
                        src={message.imageUrl}
                        alt="Message"
                        style={{
                          width: '100%',
                          borderRadius: '10px',
                          marginTop: '10px',
                        }}
                      />
                    )}
                  </div>
                  <div className="message-footer">
                    <span className="message-timestamp">
                      {new Date(message.timestamp).toLocaleString()}
                    </span>
                    <span className="message-likes">{message.likes} Likes</span>
                    <button
                      className="message-button"
                      onClick={() => handleDelete(message._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="message-button"
                      onClick={() => handleEditClick(message)}
                    >
                      Edit
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default MessagesPage;