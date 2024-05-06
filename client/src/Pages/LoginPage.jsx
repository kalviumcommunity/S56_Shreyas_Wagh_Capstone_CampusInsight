import React, { useState } from 'react';
import './Styles/LogInPage.css'; 
import MountainIcon from '../Components/MountainIcon';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import cookie from 'js-cookie';
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
   const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      '${login_uri}',
      { email, password }
    );
    if (response && response.data) {
      const token = response.data.token;
      cookie.set('userToken', token);
      cookie.set('userEmail', email);
      const username = response.data.username;
      cookie.set('username', username);
      console.log('Login successful. Token:', token);
      navigate('/home');
    } else {
      setError('Unexpected response format');
      console.error('Unexpected response format');
    }
  } catch (error) {
    setError(error.response.data.message);
    console.error('Error logging in:', error.response.data.message);
  }
};

  const handleSignUpClick = () => {
    navigate('/signup'); 
  };

  return (
    <div id='LoginPage'>
      <MountainIcon />
      <h2>Log In</h2>
      <p className='info'>Enter your information to log in to your account</p>
      <form onSubmit={handleSubmit}>
        <div className="label-input-container">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="label-input-container">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className='login'>Log In</button>
      </form>
    
      <p className="agreement-text">By clicking Log In, you agree to our <u>Terms of Service</u> and <u>Privacy Policy</u></p>

      <p className="left-align1">Join the Conversation</p>
      <p className="left-align2">Sign up to connect with friends, share photos, and be inspired.</p>

      {error && <p className="error-message">{error}</p>}

      <p>Don't have an account? <span onClick={handleSignUpClick} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Sign Up</span></p>
    </div>
  );
};

export default LoginPage;
