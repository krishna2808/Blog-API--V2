import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/styles/main.css';
import Header from '../common/Header';
import Popup from './Popup'; // Import the Popup component

const friendRequestGetUpdateDeleteUrl = `${process.env.REACT_APP_BACKEND_API_URL}/post/friend-request/`
const userProfileUrl = `${process.env.REACT_APP_BACKEND_API_URL}/post/user-profile/`
const postDeleteUrl = `${process.env.REACT_APP_BACKEND_API_URL}/post/`


const UserDetails = () => {
  const { username } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); // Use useNavigate for navigation
  const [userDetails, setUserDetails] = useState(null);
  const [showFollowersPopup, setShowFollowersPopup] = useState(false);
  const [showFollowingPopup, setShowFollowingPopup] = useState(false);
  const token = localStorage.getItem('access_token');
  const profile_username = localStorage.getItem('profile_username');

  const header = {
    'Authorization': `Bearer ${token}`,
  };

  useEffect(() => {
    axios.post(userProfileUrl, { username: profile_username }, { headers: header })
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

  const openFollowersPopup = () => {
    setShowFollowersPopup(true);
  };

  const openFollowingPopup = () => {
    setShowFollowingPopup(true);
  };

  const closePopup = () => {
    setShowFollowersPopup(false);
    setShowFollowingPopup(false);
  };

  const handleEditProfile = () => {
    navigate('/profile');
  };

  const handleDeletePost = (postId) => {
    var payload = {
      "post_id" : postId
    }
    axios.delete(postDeleteUrl, {
        headers: header,
        data: payload
    })
    .then(response => {
        console.log(`Deleting post with ID ${postId}`);
        // Example of how to update state after deletion (assuming userDetails.user_post is an array)
        setUserDetails(prevState => ({
          ...prevState,
          user_post: prevState.user_post.filter(post => post.id !== postId)
        }));
      })
      .catch(error => {
        console.error('Error deleting post:', error);
      });
  };

  const handleFollow = () => {
    var payload = {
        "friend_request_username": profile_username
    }
    axios.post(friendRequestGetUpdateDeleteUrl , 
        payload, 
        { headers: header }
    )
    .then(response => {
        // Handle follow success
        setUserDetails(prevState => ({
          ...prevState,
          friends_context: {
            ...prevState.friends_context,
            is_friend: 0,
            follower_count: prevState.friends_context.follower_count + 1
        }
    }));
    })
    .catch(error => {
        console.error('Error following user:', error);
    });
  };

  const handleUnfollow = () => {
    debugger
    var payload = {
        "friend_unfollow_username" : userDetails.user_profile.username,
        "action" : "unfollow_friend"
    }
    axios.delete(friendRequestGetUpdateDeleteUrl, {
       headers: header,
       data: payload
    })
    .then(response => {
            // Handle unfollow success
        setUserDetails(prevState => ({
        ...prevState,
        friends_context: {
            ...prevState.friends_context,
            is_friend: -1,
            follower_count: prevState.friends_context.follower_count - 1
        }
    }));
    })
    .catch(error => {
        console.error('Error unfollowing user:', error);
    });
  };

  return (
    <>
      <Header/>
      <header className="profile-header">
        <div className="profile">
          <div className="profile-image">
            <img src={`${process.env.REACT_APP_BACKEND_API_URL}${userDetails.user_profile.image}`} alt={`${userDetails.user_profile.username}'s profile`} />
          </div>
          <div className="profile-user-settings">
            <h1 className="profile-user-name">{userDetails.user_profile.username}</h1>
            {showEditProfileButton ? (
              <button className="btn profile-edit-btn" onClick={handleEditProfile}>Edit Profile</button>
            ) : (
                userDetails.friends_context.is_friend === 1 ? (
                    <button className="btn profile-edit-btn" onClick={handleUnfollow}>Unfollow</button>
                  ) : userDetails.friends_context.is_friend === 0 ? (
                    <button className="btn profile-edit-btn" disabled>Requested</button>
                  ) : (
                    <button className="btn profile-edit-btn" onClick={handleFollow}>Follow</button>
                  )
            )}
          </div>
          <div className="profile-stats">
            <ul>
              {userDetails.friends_context.is_friend == 1 || userDetails.friends_context.is_same_user  ? (
                <>
                  <li><span className="profile-stat-count">{userDetails.user_post.length}</span> posts</li>
                  <li onClick={openFollowersPopup}><span className="profile-stat-count">{userDetails.friends_context.follower_count}</span> followers</li>
                  <li onClick={openFollowingPopup}><span className="profile-stat-count">{userDetails.friends_context.following_count}</span> following</li>
                </>
              ) : (
                <>
                  <li><span className="profile-stat-count">{userDetails.friends_context.post_count}</span> posts</li>
                  <li><span className="profile-stat-count">{userDetails.friends_context.follower_count}</span> followers</li>
                  <li><span className="profile-stat-count">{userDetails.friends_context.following_count}</span> following</li>
                </>
              )}
            </ul>
          </div> 
        </div>
      </header>

      <main className="main">
        <div className="gallery">
          {userDetails.user_post.map(post => (
            <div className="gallery-item" key={post.id} tabIndex="0">
              <img src={`${process.env.REACT_APP_BACKEND_API_URL}${post.file}`} className="gallery-image" alt={post.title} />
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
                {showEditProfileButton && (
                  <button className="btn-delete" onClick={() => handleDeletePost(post.id)}>Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Popup for followers */}
      {showFollowersPopup && (
        <Popup
          title="Followers"
          items={userDetails.friends_context.follower_friends}
          onClose={closePopup}
        />
      )}

      {/* Popup for following */}
      {showFollowingPopup && (
        <Popup
          title="Following"
          items={userDetails.friends_context.following_friends}
          onClose={closePopup}
        />
      )}
    </>
  );
};

export default UserDetails;
