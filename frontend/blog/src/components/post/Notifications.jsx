import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../common/Header';
import '../../assets/styles/notifications.css';

const notificationUrl = `${process.env.REACT_APP_BACKEND_API_URL}/post/notification/`;

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const token = localStorage.getItem('access_token');

    const header = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    useEffect(() => {
        axios.get(notificationUrl, { headers: header })
            .then(response => {
                setNotifications(response.data);
            })
            .catch(error => {
                console.error('Error fetching notifications:', error);
            });
    }, []);

    const handleNotificationClick = (notificationId, postId) => {
        // Mark the notification as read
        axios.put(`${notificationUrl}${notificationId}/`, { status: true }, { headers: header })
            .then(() => {
                // Redirect to the post details page
                window.location.href = `/post/${postId}`;
            })
            .catch(error => {
                console.error('Error updating notification status:', error);
            });
    };

    return (
        <>
            <Header />
            <div className="notifications-container">
                <h2>Notifications</h2>
                <ul className="notification-list">
                    {notifications.map(notification => (
                        <li 
                            key={notification.id} 
                            className={`notification-item ${notification.status ? 'read' : 'unread'}`}
                            onClick={() => handleNotificationClick(notification.id, notification.post)}
                        >
                            <img src={`${process.env.REACT_APP_BACKEND_API_URL}/media/${notification.sender_image}`} alt="Sender" className="sender-image" />
                            <div className="notification-content">
                                <span className="notification-username">{notification.sender_username}</span> {notification.notification_type} a post.
                                <span className="notification-time">{new Date(notification.created_datetime).toLocaleString()}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default Notifications;
