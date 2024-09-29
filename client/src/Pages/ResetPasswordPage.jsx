import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Styles/ResetPasswordPage.css';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('https://s56-shreyas-wagh-capstone-campusinsight.onrender.com/resetpassword', { email, otp, password: newPassword });
      if (response.status === 200) {
        setSuccess(true);
        console.log('Password reset successfully');
        navigate('/login');
      }
    } catch (err) {
      setError('Error resetting password. Please check the OTP and try again.');
      console.error(err);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="container">
        <h2>Reset Password</h2>
        <form onSubmit={handleResetPassword}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <label>OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
          />
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
          <button type="submit">Reset Password</button>
        </form>
        {error && <p>{error}</p>}
        {success && <p>Password reset successfully! You can now log in.</p>}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
