import React from 'react';
import './Styles/Sidebar.css';
import MountainIcon from '../Components/MountainIcon';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import cookie from 'js-cookie';
import axios from 'axios';

const Sidebar = () => {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState('');

 useEffect(() => {
    const username = cookie.get('username');
    setUsername(username);
  }, []);


  const handleLogout = () => {
    cookie.remove('userToken');
    cookie.remove('userEmail');
    cookie.remove('username');
    navigate('/');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <MountainIcon />
      </div>
      <ul className="sidebar-menu">
        <li className="sidebar-menu-item">
          <span>Home</span>
        </li>
        <br />
        <li className="sidebar-menu-item">
          <span>Explore</span>
        </li>
        <li className="sidebar-menu-item">
          <span>Notifications</span>
        </li>
        <li className="sidebar-menu-item">
          <span>Messages</span>
        </li>
        <li className="sidebar-menu-item">
          <span>Bookmarks</span> 
        </li>
        <li className="sidebar-menu-item">
          <span>Lists</span> 
        </li>
        <br />
        <li className="sidebar-menu-item">
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
      <button className="sidebar-button">Post</button>
       <div className='info'>
        <p>{username}</p>
      </div>
    </div>
  );
}

export default Sidebar;
