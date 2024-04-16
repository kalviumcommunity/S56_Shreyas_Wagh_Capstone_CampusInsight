import React, { useState } from 'react';
import MountainIcon from '../Components/MountainIcon';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Styles/Username.css';
import cookie from 'js-cookie';

const Username = () => {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateUsername(username)) {
      const formData = {
        email: email,
        username: username
      };
      try {
        const response = await axios.post('https://s56-shreyas-wagh-capstone-campusinsight.onrender.com/SignUp/Username', formData);
        console.log('Response from server:', response.data);
        cookie.set('username', username);
        navigate('/home');
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const validateUsername = (username) => {
    const minLength = 3;
    const validCharacters = /^[a-zA-Z0-9_]+$/; 
    
    if (username.length < minLength) {
      setUsernameError(`Username must be at least ${minLength} characters long`);
      return false;
    }
    if (!username.match(validCharacters)) {
      setUsernameError('Username can only contain letters, numbers, and underscores');
      return false;
    }
    setUsernameError('');
    return true;
  };

  return (
    <div id='UsernamePage'>
      <MountainIcon />
      <h2>Choose Your Username</h2>
      <p className='info'>Enter your email and choose a username to create your account</p>
      <form onSubmit={handleSubmit}>
        <div className="label-input-container">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="label-input-container">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose your username"
            required
          />
          {usernameError && <p className="error">{usernameError}</p>}
        </div>
        <button type="submit" className='submitUsername'>Submit</button>
      </form>
    </div>
  );
};

export default Username;
