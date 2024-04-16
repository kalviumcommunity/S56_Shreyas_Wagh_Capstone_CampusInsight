// HomePage.js
import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import Middle from '../Components/Middle';

function HomePage() {
  const [messages, setMessages] = useState([
    {
      displayName: "User Display Name",
      username: "@username",
      timestamp: "12m ago",
      content: "This is a sample message! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec justo mauris."
    },
    // Add more sample messages here if needed
  ]);

  const handleLogout = () => {
    // Implement logout functionality here
  };

  return (
    <>
      <Sidebar handleLogout={handleLogout} />
      <Middle messages={messages} />
    </>
  );
}

export default HomePage;
