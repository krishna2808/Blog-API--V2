import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../assets/styles/main.css';
import Header from '../common/Header';


const UserDetails = () => {
  const { username } = useParams();
  const location = useLocation();
  const [userDetails, setUserDetails] = useState(null);
  const token = localStorage.getItem('access_token');
  const profile_username = localStorage.getItem('profile_username');
  

  const header = {
    'Authorization': `Bearer ${token}`,
  };

  useEffect(() => {
    axios.post(`http://localhost:8000/post/user-profile/`, { username: profile_username }, { headers: header })
      .then(response => {
        setUserDetails(response.data);
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
      });
  }, []);

  useEffect(() => {
    // Check if state was passed from Dashboard
    if (location.state && location.state.fromDashboard) {
      console.log('Data passed from Dashboard');
      // You can access more details from state if needed
    }
  }, [location]);

  if (!userDetails) {
    return <p>Loading...</p>;
  }

  const showEditProfileButton = userDetails.friends_context.is_same_user;

  return (
    <>
      <Header/>
      <header className="profile-header">
        <div className="profile">
          <div className="profile-image">
            <img src={`http://localhost:8000${userDetails.user_profile.image}`} alt={`${userDetails.user_profile.username}'s profile`} />
          </div>
          <div className="profile-user-settings">
            <h1 className="profile-user-name">{userDetails.user_profile.username}</h1>
            {showEditProfileButton && (
              <button className="btn profile-edit-btn">Edit Profile</button>
            )}
          </div>
          <div className="profile-stats">
            <ul>
              <li><span className="profile-stat-count">{userDetails.user_post.length}</span> posts</li>
              <li><span className="profile-stat-count">{userDetails.friends_context.follower_count}</span> followers</li>
              <li><span className="profile-stat-count">{userDetails.friends_context.following_count}</span> following</li>
            </ul>
          </div> 
        </div>
      </header>

      <main className="main">
        <div className="gallery">
          {userDetails.user_post.map(post => (
            <div className="gallery-item" key={post.id} tabIndex="0">
              <img src={`http://localhost:8000${post.file}`} className="gallery-image" alt={post.title} />
              <div className="gallery-item-info">
                <ul>
                  <li className="gallery-item-likes">
                    <span className="visually-hidden">Likes:</span>
                    <i className="fas fa-heart" aria-hidden="true"></i> {post.post_like.length}
                  </li>
                  <li className="gallery-item-comments">
                    <span className="visually-hidden">Comments:</span>
                    <i className="fas fa-comment" aria-hidden="true"></i> {post.post_comment.length}
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default UserDetails;
