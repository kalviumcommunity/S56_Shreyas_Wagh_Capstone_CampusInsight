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

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        if (!user || !firstName || !lastName) return;

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