import React, { useState } from 'react';
import './Styles/LogInPage.css';
import MountainIcon from '../Components/MountainIcon';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { email, password });
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

      <p>Don't have an account? <Link to={"/signup"}>Sign Up</Link></p>
    </div>
  );
};

export default LoginPage;
