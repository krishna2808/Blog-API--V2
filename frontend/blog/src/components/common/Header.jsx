import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    const handleSearchChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length >= 3) {
            // Simulating an AJAX request to fetch usernames
            const response = await fetch(`/api/search-usernames?q=${query}`);
            const data = await response.json();
            setSearchResults(data);
        } else {
            setSearchResults([]);
        }
    };

    const handleResultClick = (username) => {
        setSearchQuery('');
        setSearchResults([]);
        navigate(`/user-details/${username}`);
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
                                    />
                                    {searchResults.length > 0 && (
                                        <ul className="list-group position-absolute" style={{ zIndex: 1000 }}>
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
                            {/* <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" to="/profile" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <img src="profile.png" className="profile-default" alt="Profile" />
                                </Link>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <li><Link to="/chat" className="dropdown-item">Profile</Link></li>
                                    <li><Link to="/chat" className="dropdown-item">LogOut</Link></li>
                                </ul>
                            </li> */}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Header;
