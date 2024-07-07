// Popup.js

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

const Popup = ({ title, items, onClose }) => {
  const navigate = useNavigate(); // Use useNavigate for navigation

  const handleUserClick = (username) => {
    debugger
    // navigate(`/user/${username}`);
    // onClose(); // Close the popup after navigation
    localStorage.setItem('profile_username', username);
    navigate(`/user-profile/?username=${username}`);
    onClose();
    window.location.reload();

  };

  return (
<div className="popup">
      <div className="popup-content">
        <div className="popup-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
        <div className="popup-body">
          <ul>
            {items.map((item, index) => (
              <li key={index} onClick={() => handleUserClick(item.username)}>
                <img src={`${process.env.REACT_APP_BACKEND_API_URL}/media/${item.image}`} alt={`${item.username}'s profile`} />
                <span>{item.username}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Popup;
