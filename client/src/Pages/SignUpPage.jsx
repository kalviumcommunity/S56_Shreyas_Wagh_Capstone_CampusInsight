import React, { useState } from 'react';
import './Styles/SignupPage.css';
import MountainIcon from '../Components/MountainIcon';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios'; 
import cookie from 'js-cookie';

const SignUpPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
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
          navigate('/Username'); 
        })
        .catch(error => {
          console.error('Error submitting form:', error);
        });
    }
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!firstName) {
      errors.firstName = 'First name is required';
      isValid = false;
    }

    if (!lastName) {
      errors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
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
          {errors.firstName && <p className="error">{errors.firstName}</p>}
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
          {errors.lastName && <p className="error">{errors.lastName}</p>}
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
          {errors.email && <p className="error">{errors.email}</p>}
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
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <button type="submit" className='signUp'> Sign Up</button>
      </form>
      <p className="agreement-text">By clicking Sign Up, you agree to our <u>Terms of Service</u> and <u>Privacy Policy</u></p>
      <p className="left-align1">Join the Conversation</p>
      <p className="left-align2">Sign up to connect with friends, share photos, and be inspired.</p>
      <div className="sign-up-buttons">
        <button>Sign up with Google</button>
        <button>Sign up with Facebook</button>
        <button>Sign up with Apple</button>
      </div>
       <p>Already have an account? <span onClick={() => navigate('/login')}>Login</span></p>
    </div>
  );
};

export default SignUpPage;
