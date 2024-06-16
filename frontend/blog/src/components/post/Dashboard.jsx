import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/main.css';
import axios from 'axios';
import Header from '../common/Header';



const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [newComments, setNewComments] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [expandedLikes, setExpandedLikes] = useState({});
  const token = localStorage.getItem('access_token');
  const loginUserId = localStorage.getItem('user_id');
  const navigate = useNavigate();

  const header = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  useEffect(() => {
    axios.get('http://localhost:8000/post/post-list/', { headers: header })
      .then(response => {
        setPosts(response.data.results);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleCommentChange = (postId, comment) => {
    setNewComments({ ...newComments, [postId]: comment });
  };

  const handleCommentSubmit = (e, post) => {
    const postId = post.id;
    e.preventDefault();
    const comment = newComments[postId];
    const payload = {
      user_id: loginUserId,
      post_id: postId,
      comment: comment,
    };

    axios.post(`http://localhost:8000/post/post-comment/`, payload, { headers: header })
      .then(response => {
        axios.get('http://localhost:8000/post/post-list/', { headers: header })
          .then(response => {
            setPosts(response.data.results);
            setNewComments({ ...newComments, [postId]: '' });
          })
          .catch(error => {
            console.log(error);
          });
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const toggleComments = (postId) => {
    setExpandedComments(prevState => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
  };

  const toggleLikes = (postId) => {
    setExpandedLikes(prevState => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
  };

  const handleLike = (postId) => {
    axios.post(`http://localhost:8000/post/post-like/`, { post_id: postId }, { headers: header })
      .then(response => {
        setPosts(prevPosts => prevPosts.map(post => {
          if (post.id === postId) {
            return { ...post, post_like: response.data.likes };
          }
          return post;
        }));
      })
      .catch(error => {
        console.log(error);
      });
  };

  const goToProfile = (username) => {
    localStorage.setItem('profile_username', username);
    navigate(`/user-profile/?username=${username}`);


  };

  return (
    <>
        <Header/>
        <div className="instagram-dashboard">
        {posts.map(post => (
            <div key={post.id} className="post">
            <div className="post-header">
                <img 
                src={`http://localhost:8000/media/${post.user_image}`} 
                alt={`${post.username}'s profile`} 
                className="user-image" 
                onClick={() => goToProfile(post.username)}
                />
                <p className="post-username" onClick={() => goToProfile(post.username)}>Posted by: {post.username}</p>
            </div>
            <p className="post-title">Title: {post.title}</p>
            <p className="post-created-datetime">Created on: {new Date(post.created_datetime).toLocaleString()}</p>
            {post.file && <img src={post.file} alt="Post" className="post-image" />}
            <p className="post-description">Description: {post.description}</p>

            <div className="post-details">
                <p className="post-likes">Likes: {post.post_like ? post.post_like.length : 0}</p>
                {post.post_like && post.post_like.length > 0 && (
                <div className="liked-users">
                    <p>Liked by:</p>
                    {post.post_like.length > 1 && !expandedLikes[post.id] ? (
                    <div className="liked-user">
                        <img src={`http://localhost:8000/media/${post.post_like[0].user_image}`} alt={`${post.post_like[0].username}'s profile`} className="user-image" />
                        <strong>{post.post_like[0].username}</strong>
                        <button onClick={() => toggleLikes(post.id)}>Show all likes</button>
                    </div>
                    ) : (
                    post.post_like.map(like => (
                        <div key={like.id} className="liked-user">
                        <img src={`http://localhost:8000/media/${like.user_image}`} alt={`${like.username}'s profile`} className="user-image" />
                        <strong>{like.username}</strong>
                        </div>
                    ))
                    )}
                    {post.post_like.length > 1 && expandedLikes[post.id] && (
                    <button onClick={() => toggleLikes(post.id)}>Show less likes</button>
                    )}
                </div>
                )}
                <button onClick={() => handleLike(post.id)} className="like-button">Like</button>
                <ul className="post-comments">
                {post.post_comment && post.post_comment.slice(0, expandedComments[post.id] ? post.post_comment.length : 1).map(comment => (
                    <li key={comment.id} className="comment">
                    <div className="comment-header">
                        <img src={`http://localhost:8000/media/${comment.user_image}`} alt="Commenter's profile" className="user-image" />
                        <strong className="comment-username">User {comment.user}: </strong>
                    </div>
                    {comment.comment}
                    <br />
                    <span className="comment-created-datetime">Commented on: {new Date(comment.created_datetime).toLocaleString()}</span>
                    </li>
                ))}
                </ul>
                {post.post_comment && post.post_comment.length > 1 && (
                <button onClick={() => toggleComments(post.id)}>
                    {expandedComments[post.id] ? 'Show less comments' : 'Show more comments'}
                </button>
                )}
            </div>

            <form onSubmit={(e) => handleCommentSubmit(e, post)} className="comment-form">
                <input
                type="text"
                name="comment"
                value={newComments[post.id] || ''}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                placeholder="Add a comment..."
                required
                />
                <button type="submit">Comment</button>
            </form>
            </div>
        ))}
        </div>
    </>
  );
};

export default Dashboard;
