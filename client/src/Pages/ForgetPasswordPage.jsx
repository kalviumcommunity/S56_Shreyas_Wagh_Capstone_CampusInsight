import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Styles/ForgetPasswordPage.css';

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/forgetpassword', { email });
      if (response.status === 200) {
        console.log('OTP sent successfully');
        navigate('/resetpassword');
      }
    } catch (err) {
      setError('Error sending OTP. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="forget-password-page">
      <div className="container">
        <h2>Forgot Password</h2>
        <form onSubmit={handleEmailSubmit}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <button type="submit">Send OTP</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
