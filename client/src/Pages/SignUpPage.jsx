import React, { useState } from 'react';
import './Styles/SignupPage.css';
import MountainIcon from '../Components/MountainIcon';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import cookie from 'js-cookie';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };
    axios.post(
      'https://s56-shreyas-wagh-capstone-campusinsight.onrender.com/SignUp', formData)
      .then(response => {
        console.log('Response from server:', response.data);
        cookie.set('userToken', response.data.token);
        cookie.set('userEmail', email); 
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        navigate('/username');
      })
      .catch(error => {
        console.error('Error submitting form:', error);
      });
  };

  return (
    <div id='SignUp'>
      <MountainIcon />
      <h2>Sign Up</h2>
      <p className='info'>Enter your information to create an account</p>
      <form onSubmit={handleSubmit}>
        <div className="label-input-container">
          <label>First name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter your first name"
            required
          />
        </div>
        <div className="label-input-container">
          <label>Last name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter your last name"
            required
          />
        </div>
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
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
         <button type="submit" className='signUp'>Sign Up</button>
      </form>
      <p className="agreement-text">By clicking Sign Up, you agree to our <u>Terms of Service</u> and <u>Privacy Policy</u></p>
      <p className="left-align1">Join the Conversation</p>
      <p className="left-align2">Sign up to connect with friends, share photos, and be inspired.</p>
      <div className="sign-up-buttons">
        <button>Sign up with Google</button>
        <button>Sign up with Facebook</button>
        <button>Sign up with Apple</button>
      </div>
      <p>Already have an account? <Link to={"/login"}>Login</Link></p>
    </div>
  );
};

export default SignUpPage;
