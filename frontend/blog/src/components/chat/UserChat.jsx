import React, { useState, useEffect } from 'react';
import '../../assets/styles/chat.css';

function UserChat({ user }) {
  const currentUser = localStorage.getItem('username');
  const [messages, setMessages] = useState(user.chat_room || []);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/?token=${token}`);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const newMsg = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newMsg]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '' && socket) {
      const newMsg = {
        message: newMessage,
        sender: currentUser,
        roomId: user.roomId,
        action: "message",
      };
      socket.send(JSON.stringify(newMsg));
      setNewMessage('');
    }
  };

  return (
    <div>
      <h2 className="chat-header">
        {user.type === 'DM' ? (
          <>
            <img src={user.members[0].image} alt={`${user.members[0].username}'s profile`} />
            {user.members[0].username}
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
            <div>
              <strong>{message.sender}</strong> <span>({message.timestamp})</span>
            </div>
            <div>{message.message}</div>
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
