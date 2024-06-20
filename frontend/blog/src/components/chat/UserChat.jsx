import React, { useState, useEffect, useRef } from 'react';
import '../../assets/styles/chat.css';

function UserChat({ user }) {
  const currentUser = localStorage.getItem('username');
  const [messages, setMessages] = useState(user.chat_room || []);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socketRef = useRef(null);
  const [roomId, setRoomId] = useState(user.roomId);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (socketRef.current) {
      if (socketRef.current.readyState === WebSocket.OPEN && socketRef.current.roomId === roomId) {
        return;
      }
      if (socketRef.current.readyState === WebSocket.OPEN && socketRef.current.roomId !== roomId) {
        socketRef.current.close();
      }
    }

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomId}/?token=${token}`);
    ws.roomId = roomId;

    ws.onopen = () => {
      console.log('WebSocket connected to room:', roomId);
      socketRef.current = ws;
    };

    ws.onmessage = (event) => {
      const newMsg = JSON.parse(event.data);
      if (newMsg.action === "onlineUser") {
        setOnlineUsers(newMsg.userList);
      } else {
        setMessages((prevMessages) => [...prevMessages, newMsg]);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed for room:', roomId);
      socketRef.current = null;
    };

    return () => {
      if (ws) ws.close();
    };
  }, [roomId]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '' && socketRef.current) {
      const newMsg = {
        message: newMessage,
        sender: currentUser,
        roomId: user.roomId,
        action: "message"
      };
      socketRef.current.send(JSON.stringify(newMsg));
      setNewMessage('');
    }
  };

  useEffect(() => {
    setRoomId(user.roomId);
    setMessages(user.chat_room || []);
  }, [user]);

  const selectedUser = user.type === 'DM' ? user.members[0] : null;
  const isSelectedUserOnline = selectedUser ? onlineUsers.includes(selectedUser.username) : false;

  return (
    <div>
      <h2 className="chat-header">
        {user.type === 'DM' ? (
          <>
            <img src={selectedUser.image} alt={`${selectedUser.username}'s profile`} />
            {selectedUser.username}
            <span className={isSelectedUserOnline ? 'status online' : 'status offline'}>
              {isSelectedUserOnline ? 'Online' : 'Offline'}
            </span>
          </>
        ) : (
          <>
            <img src={user.image} alt={`${user.name}'s group pic`} />
            {user.name}
          </>
        )}
      </h2>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message ${message.sender === currentUser ? 'sent' : 'received'}`}
          >
            <div className="message-header">
              <img 
                src={`http://localhost:8000/media/${message.sender_image}`} 
                alt={`${message.sender}'s profile`} 
                className="profile-pic"
              />
              <div className="message-content">
                {user.type !== 'DM' && <strong>{message.sender}</strong>}
                <div className="message-text">{message.message}</div>
              </div>
              <div className="message-timestamp">
                <span>({message.timestamp})</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default UserChat;
