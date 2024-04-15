import React, { useState } from 'react';
import MountainIcon from '../Components/MountainIcon';
import { Link } from 'react-router-dom';
import axios from 'axios'; 

const Username = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      email: email,
      username: username
    };
    axios.post(
      'http://localhost:3000/SignUp/Username', formData) 
      .then(response => {
        console.log('Response from server:', response.data);
      })
      .catch(error => {
        console.error('Error submitting form:', error);
      });
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
        </div>
        <button type="submit" className='submitUsername'><span onClick={()=>navigate('/home')}>Submit</span></button>
      </form>
       <p>Already have an account? <span onClick={() => navigate('/login')}>Login</span></p>
    </div>
  );
};

export default Username;
