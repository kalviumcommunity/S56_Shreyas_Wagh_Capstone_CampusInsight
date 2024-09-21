import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';  // Import js-cookie
import Sidebar from '../Components/Sidebar';
import './Styles/BookMarks.css';

const BookMarks = () => {
  const [bookmarkedMessages, setBookmarkedMessages] = useState([]);

  // Retrieve username from the cookies
  const username = Cookies.get('username');  // Fetch username from the cookie

  useEffect(() => {
    if (username) {
      fetchBookmarkedMessages();
    }
  }, [username]);

  const fetchBookmarkedMessages = () => {
    fetch(`http://localhost:3000/bookmarkedMessages?username=${username}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data.bookmarkedMessages && Array.isArray(data.bookmarkedMessages)) {
          setBookmarkedMessages(data.bookmarkedMessages);
        } else {
          console.error('Unexpected data format:', data);
          setBookmarkedMessages([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching bookmarked messages:', error);
        setBookmarkedMessages([]);
      });
  };

  // Handle removing bookmark
  const handleRemoveBookmark = (messageId) => {
    fetch('http://localhost:3000/removeBookmark', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messageId, username }), // Send messageId and username
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Message removed from bookmarks') {
          // Update UI by removing the message from the local state
          setBookmarkedMessages((prevMessages) =>
            prevMessages.filter((msg) => msg._id !== messageId)
          );
        } else {
          console.error('Error removing bookmark:', data);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <>
      <Sidebar className="sidebar" />
      <div className="bookmarks-container">
        {Array.isArray(bookmarkedMessages) && bookmarkedMessages.length > 0 ? (
          bookmarkedMessages.map((messageObj, index) => (
            <div key={index} className="message-box">
              <p className="message-username">{messageObj.username}</p>
              <p className="message-content">{messageObj.message}</p>
              <div className="message-info">
                <span>{new Date(messageObj.timestamp).toLocaleString()}</span>
                <div className="likes-container">
                  <span className="likes-icon">❤️</span>
                  <span className="likes-count">{messageObj.likes} Likes</span>
                </div>
                {/* Remove Bookmark Icon */}
                <button
                  className="remove-bookmark-button"
                  onClick={() => handleRemoveBookmark(messageObj._id)}
                >
                  🗑️ Remove Bookmark
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No bookmarked messages available.</p>
        )}
      </div>
    </>
  );
};

export default BookMarks;
