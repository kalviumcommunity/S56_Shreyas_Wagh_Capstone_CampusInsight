import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Styles/Profile.css';

function ProfilePage() {
    const [user, setUser] = useState(null);

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
            })
            .catch(error => {
                console.error('There was an error fetching the user data!', error);
            });
    }, []);
    
    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <h1>{user.username}</h1>
            <p>Email: {user.email}</p>
            <p>First Name: {user.firstName}</p>
            <p>Last Name: {user.lastName}</p>
        </div>
    );
}

export default ProfilePage;
