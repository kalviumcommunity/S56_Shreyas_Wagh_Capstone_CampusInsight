import React from 'react';
import './Styles/Sidebar.css';
import cookie from 'js-cookie';
import MountainIcon from '../Components/MountainIcon';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {

  const handleLogout = () => {
  const navigate = useNavigate(); 
    cookie.remove('userToken');
    cookie.remove('userEmail');
    navigate('/LandingPage');
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
      </ul>
      <ul className="sidebar-menu">
        <li className="sidebar-menu-item">
          <span>Explore</span>
        </li>
      </ul>
      <ul className="sidebar-menu">
        <li className="sidebar-menu-item">
          <span>Notifications</span>
        </li>
        <li className="sidebar-menu-item">
          <span>Messages</span>
        </li>
        <li className="sidebar-menu-item">
          <span>Bookmarks</span> 
        </li>
        <br />
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
          <span>Profile</span>
        </li>
         <br />
         <li className="sidebar-menu-item">
        <span onClick={handleLogout}>Logout</span>
        </li>
      </ul>
        <button className="sidebar-button">Post</button>
        <div className='info'>
            Iamtiger
            <br />
            @Iamtiger2004
        </div>
    </div>
  );
}


export default Sidebar;
