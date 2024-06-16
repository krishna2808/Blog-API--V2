import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/styles/main.css';
import Header from '../common/Header';


function Profile() {
    const [user, setUser] = useState({
        profilePic: '',
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        mobile: '',
        address: '',
        bio: '',
    });

    const token = localStorage.getItem('access_token');
    const header = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    useEffect(() => {
        axios.get('http://localhost:8000/account/profile/', { headers: header })
            .then(response => {
                const data = response.data;
                setUser({
                    profilePic: data.image || '',
                    firstName: data.first_name || '',
                    lastName: data.last_name || '',
                    username: data.username || '',
                    email: data.email || '',
                    mobile: data.mobile || '',
                    address: data.address || '',
                    bio: data.bio || '',
                });
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleProfilePicChange = (e) => {
        setUser({ ...user, profilePic: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', user.profilePic);
        formData.append('first_name', user.firstName);
        formData.append('last_name', user.lastName);
        formData.append('username', user.username);
        formData.append('email', user.email);
        formData.append('mobile', user.mobile);
        formData.append('address', user.address);
        formData.append('bio', user.bio);

        axios.put('http://localhost:8000/account/profile/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(response => {
                console.log('Profile updated successfully!');
            })
            .catch(error => {
                console.error('Error updating profile:', error);
            });
    };

    return (
        <>
            <Header/>

            <div className="profile-container">
            <h1>Profile</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="profilePic" className="form-label">Profile Picture</label>
                    <input type="file" className="form-control" id="profilePic" name="profilePic" onChange={handleProfilePicChange} />
                    {user.profilePic && <img src={typeof user.profilePic === 'string' ? user.profilePic : URL.createObjectURL(user.profilePic)} alt="Profile" className="profile-pic" />}
                </div>
                <div className="form-group">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input type="text" className="form-control" id="firstName" name="firstName" value={user.firstName} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input type="text" className="form-control" id="lastName" name="lastName" value={user.lastName} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" className="form-control" id="username" name="username" value={user.username} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={user.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="mobile" className="form-label">Mobile</label>
                    <input type="text" className="form-control" id="mobile" name="mobile" value={user.mobile} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input type="text" className="form-control" id="address" name="address" value={user.address} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="bio" className="form-label">Bio</label>
                    <textarea className="form-control" id="bio" name="bio" value={user.bio} onChange={handleChange} />
                </div>
                <button type="submit" className="btn-primary">Submit</button>
            </form>
        </div>




        </>

    );
}

export default Profile;
