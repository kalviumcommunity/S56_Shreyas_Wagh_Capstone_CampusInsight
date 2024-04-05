import React, { useState } from 'react';
import './Styles/LogInPage.css'; 
import MountainIcon from '../Components/MountainIcon';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://s56-shreyas-wagh-capstone-campusinsight.onrender.com/login',
        { email, password }
      );
      const token = response.data.token;
      console.log('Login successful. Token:', token);
    } catch (error) {
      setError(error.response.data.message);
      console.error('Error logging in:', error.response.data.message);
    }
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

      <p>Don't have an account? <Link to={"/signup"}>Sign Up</Link></p>
    </div>
  );
};

export default LoginPage;
