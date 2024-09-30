import React, { useState } from 'react';
import './Styles/SignupPage.css';
import MountainIcon from '../Components/MountainIcon';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from 'axios'; 
import cookie from 'js-cookie';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const clientId = '74212427658-976mh289boiprbga1me1ermdbpvksiij.apps.googleusercontent.com';
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true); 
    const formData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };
    axios.post(
      'http://localhost:3000/SignUp', formData)
      .then(response => {
        console.log('Response from server:', response.data);
        cookie.set('userToken', response.data.token);
        cookie.set('userEmail', email); 
        cookie.set('userId', response.data.userId); 
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        navigate('/username');
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        alert('There was an issue creating your account. Please try again.');
      })
      .finally(() => {
        setIsSubmitting(false); 
      });
  };

  const onSuccess = (res) => {
    console.log('Google SignUp successful!🎉', res);
    alert('Google SignUp successful!🎉');
    cookie.set('googleToken', res.credential); 
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    navigate('/username'); 
  };

  const onError = (error) => {
    console.error('Google SignUp Failed', error);
    alert('Google Sign-Up failed due to a network issue or authorization error. Please check your internet connection and try again.');
  };

  return (
    <div id='SignUp'>
      <h2>Sign Up</h2>
      <MountainIcon />
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
         <button type="submit" className='signUp' disabled={isSubmitting}>
           {isSubmitting ? 'Signing Up...' : 'Sign Up'}
         </button>
      </form>

      <p className="agreement-text">By clicking Sign Up, you agree to our <u>Terms of Service</u> and <u>Privacy Policy</u></p>
      <p className="left-align1">Join the Conversation</p>
      <p className="left-align2">Sign up to connect with friends, share photos, and be inspired.</p>

      <div className="sign-up-buttons">
        <div className="google">
          <GoogleOAuthProvider clientId={clientId}> 
            <GoogleLogin
              onSuccess={onSuccess}
              onError={onError} // Enhanced error handling
            />
          </GoogleOAuthProvider>
        </div>

        <button>Sign up with Facebook</button>
        <button>Sign up with Apple</button>
      </div>
      
      <p>Already have an account? <Link to={"/login"}>Login</Link></p>
    </div>
  );
};

export default SignUpPage;
