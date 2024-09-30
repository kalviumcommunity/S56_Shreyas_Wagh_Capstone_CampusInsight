import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Styles/Profile.css';
import Sidebar from '../Components/Sidebar';

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const userEmail = Cookies.get('userEmail');  // Fetch email from cookies

        if (!userEmail) {
            console.error('User email not found in cookies');
            return;
        }

        // Fetch user details based on the email
        axios.get(`http://localhost:3000/getUserByEmail/${userEmail}`)
            .then(response => {
                setUser(response.data);
                setFirstName(response.data.firstName); // Initialize with current data
                setLastName(response.data.lastName); // Initialize with current data
            })
            .catch(error => {
                console.error('There was an error fetching the user data!', error);
            });
    }, []);

    // Validation function for form fields
    const validateFields = () => {
        if (!firstName.trim() || !lastName.trim()) {
            setError('First name and last name cannot be empty');
            return false;
        }

        if (firstName.length < 2 || lastName.length < 2) {
            setError('First name and last name must be at least 2 characters long');
            return false;
        }

        return true;
    };

    const handleEdit = () => {
        setIsEditing(true);
        setError(''); // Clear any previous error when entering edit mode
    };

    const handleSave = () => {
        if (!user) return;

        // Run validation before saving
        if (!validateFields()) {
            return;
        }

        // If validation passes, send the PUT request
        axios.put(`http://localhost:3000/updateUser/${user._id}`, {
            firstName,
            lastName
        })
        .then(response => {
            console.log('User updated successfully:', response.data);
            setIsEditing(false);
            setUser({ ...user, firstName, lastName });
        })
        .catch(error => {
            console.error('Error updating user information:', error);
            setError('There was an error updating your profile. Please try again.');
        });
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <Sidebar />
        <div className="profile-container">
            <h1>{user.username}</h1>
            <p>Email: {user.email}</p>

            <div className="edit-section">
                <label>First Name: </label>
                {isEditing ? (
                    <input 
                        type="text" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                    />
                ) : (
                    <span>{user.firstName}</span>
                )}
            </div>

            <div className="edit-section">
                <label>Last Name: </label>
                {isEditing ? (
                    <input 
                        type="text" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                    />
                ) : (
                    <span>{user.lastName}</span>
                )}
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="button-container">
                {isEditing ? (
                    <button onClick={handleSave}>Save Changes</button>
                ) : (
                    <button onClick={handleEdit}>Edit Profile</button>
                )}
            </div>
        </div>
        </>
    );
}

export default ProfilePage;
