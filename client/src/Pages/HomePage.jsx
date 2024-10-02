import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import Middle from '../Components/Middle';
import axios from 'axios';

function HomePage() {
  const [messages, setMessages] = useState([]);
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`https://s56-shreyas-wagh-capstone-campusinsight.onrender.com/getMessages`); 
      setMessages(response.data); 
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []); 

  const handleLogout = () => {
    // Logout functionality
  };

  return (
    <>
      <Sidebar handleLogout={handleLogout} />
      <Middle messages={messages} /> 
    </>
  );
}

export default HomePage;
