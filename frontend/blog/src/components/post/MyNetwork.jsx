import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/styles/network.css';
import Header from '../common/Header';

const MyNetwork = () => {
  const [requestedUsers, setRequestedUsers] = useState([]);
  const token = localStorage.getItem('access_token');
  const navigate = useNavigate();

  const header = {
    'Authorization': `Bearer ${token}`,
  };

  useEffect(() => {
    axios.get(`http://localhost:8000/post/friend-request/`, { headers: header })
      .then(response => {
        setRequestedUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching network requests:', error);
      });
  }, []);

  const handleAcceptRequest = (username) => {
    var payload = {
        "accept_friend_request_username": username,
        "friend_request" : 1
    }
    axios.put(`http://localhost:8000/post/friend-request/`, 
       payload, 
       { headers: header }
    )
    .then(response => {
        // Handle accept request success
        setRequestedUsers(prevState => prevState.filter(user => user.current_user_username !== username));
    })
    .catch(error => {
        console.error('Error accepting request:', error);
    });
  };

  const handleCancelRequest = (username) => {
    var payload = {
        "cancel_friend_request_username": username,
        "action" : "cancel_friend_request"
    }
    axios.delete(`http://localhost:8000/post/friend-request/`,
    {
        headers: header,
        data: payload
     })
    .then(response => {
        // Handle cancel request success
        setRequestedUsers(prevState => prevState.filter(user => user.current_user_username !== username));
    })
    .catch(error => {
        console.error('Error cancelling request:', error);
    });
  };

  const handleProfileRedirect = (username) => {
    localStorage.setItem('profile_username', username);
    navigate(`/user-profile/?username=${username}`);
  };

  return (
    <>
      <Header />
      <div className="network-container">
        <h2>My Network</h2>
        {requestedUsers.length === 0 ? (
          <p>No pending network requests.</p>
        ) : (
          <div className="network-list">
            {requestedUsers.map(user => (
              <div className="network-item" key={user.current_user_username}>
                <div className="network-profile" onClick={() => handleProfileRedirect(user.current_user_username)}>
                  <img src={`http://localhost:8000/media/${user.friend_image}`} alt={`${user.current_user_username}'s profile`} className="network-profile-pic" />
                  <span className="network-username">{user.current_user_username}</span>
                </div>
                <div className="network-buttons">
                  <button className="btn network-accept-btn" onClick={() => handleAcceptRequest(user.current_user_username)}>Accept</button>
                  <button className="btn network-cancel-btn" onClick={() => handleCancelRequest(user.current_user_username)}>Cancel Request</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyNetwork;
