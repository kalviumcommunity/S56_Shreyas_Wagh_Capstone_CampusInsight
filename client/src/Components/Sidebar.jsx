import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cookie from 'js-cookie';
import MountainIcon from '../Components/MountainIcon';
import PostModal from '../Components/PostModal';
import './Styles/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const username = cookie.get('username');
    setUsername(username);
  }, []);

  const handleLogout = () => {
    cookie.remove('userToken');
    cookie.remove('userEmail');
    cookie.remove('username');
    setUsername(''); 
    navigate('/'); 
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleProfileClick = () => {
    navigate('/profile'); // Navigate to the Profile Page
  };

  const handleHomeClick = () => {
    navigate('/home'); // Navigate to the Home Page
  };

  const handleBookmarksClick = () => {
    navigate('/bookmarks'); // Navigate to the Bookmarks Page
  };

  const handleMessagesClick = () => {
    navigate('/messages'); // Navigate to the Messages Page
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <MountainIcon />
      </div>
      <ul className="sidebar-menu">
        <li className="sidebar-menu-item" onClick={handleHomeClick}>
          <span>Home</span>
        </li>
        <br />
        <li className="sidebar-menu-item">
          <span>Explore</span>
        </li>
        <li className="sidebar-menu-item">
          <span>Notifications</span>
        </li>
        <li className="sidebar-menu-item" onClick={handleMessagesClick}>
          <span>Messages</span>
        </li>
        <li className="sidebar-menu-item" onClick={handleBookmarksClick}>
          <span>Bookmarks</span>
        </li>
        <li className="sidebar-menu-item">
          <span>Lists</span>
        </li>
        <br />
        <li className="sidebar-menu-item" onClick={handleProfileClick}>
          <span>Profile</span>
        </li>
        <br />
        <li className="sidebar-menu-item">
          <span>More</span>
        </li>
        <br />
        <li className="sidebar-menu-item">
          <span>Premium</span>
        </li>
        <br />
        <li className="sidebar-menu-item">
          <span onClick={handleLogout}>Logout</span>
        </li>
      </ul>
      <button className="sidebar-button" onClick={toggleModal}>Post</button>
      <div className="info">
        <p>{username}</p>
      </div>
      <PostModal isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  );
};

export default Sidebar;