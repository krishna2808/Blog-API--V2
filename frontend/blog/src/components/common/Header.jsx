import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/styles/header.css';
import axios from 'axios';



function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');
    const header = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    const handleSearchChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length >= 2) {
            // Simulate an AJAX request to fetch usernames
            // const response = await fetch(`http://localhost:8000/chat/search_user/?q=${query}`);
            // const data = await response.json();
            axios.get(`http://localhost:8000/post/search_user?query=${searchQuery}`, { headers: header })
            .then(response => setSearchResults(response.data.data))
            .catch(error => console.error('Error fetching usernames:', error));
            // setSearchResults(data);
        } else {
            setSearchResults([]);
        }
    };






    const handleResultClick = (username) => {
        setSearchQuery('');
        setSearchResults([]);
        localStorage.setItem('profile_username', username);

        navigate(`/user-profile/?username=${username}`);
        window.location.reload();


    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/dashboard">Home</Link>
                    <Link className="navbar-brand" to="/create-post">
                        <img src="add_post.png" className="chat-default" alt="add-post" />
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <div className="d-flex position-relative">
                                    <input
                                        className="form-control me-2"
                                        type="search"
                                        placeholder="Search"
                                        aria-label="Search"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        style={{ position: 'relative' }}
                                    />
                                    {searchResults.length > 0 && (
                                        <ul className="list-group position-absolute" style={{ zIndex: 1000, top: '100%', left: 0, right: 0 }}>
                                            {searchResults.map((user) => (
                                                <li
                                                    key={user.username}
                                                    className="list-group-item"
                                                    onClick={() => handleResultClick(user.username)}
                                                >
                                                    {user.username}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/chat">
                                    <img src="message_logo.jpeg" className="chat-default" alt="Chat" />
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">
                                    <img src="profile.png" className="chat-default" alt="Profile" />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Header;
