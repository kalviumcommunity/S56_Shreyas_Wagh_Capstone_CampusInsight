import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Cookies from "js-cookie"; // Import js-cookie

const SOCKET_SERVER_URL = "http://localhost:4000";

const ChatPage = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [username, setUsername] = useState(""); // State for the username

  useEffect(() => {
    // Retrieve the username from cookies
    const userCookie = Cookies.get("username"); // Adjust this key based on your cookie setup
    setUsername(userCookie || "Anonymous"); // Default to "Anonymous" if not found

    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.on("newMessage", (newMessage) => {
      // Add incoming messages to chatMessages
      setChatMessages((prevMessages) => [
        ...prevMessages,
        newMessage,
      ]);
    });

    return () => newSocket.disconnect();
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      console.log("Sending message as username:", username);

      // Emit the message to the server
      socket.emit("chatMessage", {
        messageText: message,
        username: username, // Include the username in the message data
      });

      // Clear the message input field
      setMessage(""); // Clear the input field after sending
    }
  };

  // Function to determine if the message is sent by the user
  const isSentByUser = (msg) => {
    return msg.username === "You";
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Real-Time Chat</h2>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
        }}
      >
        {chatMessages.map((msg, index) => (
          <div key={index}>
            <strong>{isSentByUser(msg) ? "You" : msg.username}: </strong>
            <span>{msg.message}</span>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ marginTop: "10px", width: "80%" }}
      />
      <button onClick={sendMessage} style={{ marginLeft: "10px" }}>
        Send
      </button>
    </div>
  );
};

export default ChatPage;
