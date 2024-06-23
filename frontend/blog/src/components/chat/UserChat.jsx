import React, { useState, useEffect, useRef } from 'react';
import '../../assets/styles/chat.css';


const websocketUrl = `${process.env.REACT_APP_BACKEND_WS_URL}/ws/chat`;


function UserChat({ user }) {
  const currentUser = localStorage.getItem('username');
  const [messages, setMessages] = useState(user.chat_room || []);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [roomId, setRoomId] = useState(user.roomId);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

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

    const ws = new WebSocket(`${websocketUrl}/${roomId}/?token=${token}`);
    ws.roomId = roomId;

    ws.onopen = () => {
      console.log('WebSocket connected to room:', roomId);
      socketRef.current = ws;
    };

    ws.onmessage = (event) => {
      const newMsg = JSON.parse(event.data);
      if (newMsg.action === "onlineUser") {
        setOnlineUsers(newMsg.userList);
      } else if (newMsg.action === "typing") {
        handleTypingIndicator(newMsg.user);
      } else if (newMsg.action === "file") {
        // Handle file message received via WebSocket
        setMessages((prevMessages) => [...prevMessages, newMsg]);
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
    if ((newMessage.trim() !== '' || fileInputRef.current.files.length > 0) && socketRef.current) {
      if (newMessage.trim() !== '') {
        const newMsg = {
          message: newMessage,
          sender: currentUser,
          roomId: user.roomId,
          action: "message"
        };
        socketRef.current.send(JSON.stringify(newMsg));
        setNewMessage('');
        clearTypingIndicator();
      }

      if (fileInputRef.current.files.length > 0) {
        const file = fileInputRef.current.files[0];
        const formData = new FormData();
        formData.append('file', file); // Ensure 'file' is appended correctly
        console.log("file ------ ", file)
        console.log("formData ------ ", formData)
  
        const newFileMsg = {
          message: `File: ${file.name}`,
          sender: currentUser,
          roomId: user.roomId,
          action: "file",
          file: formData  // Include formData directly
        };
  
  
        socketRef.current.send(JSON.stringify(newFileMsg));
  
        // Update local state to show the file message
        setMessages(prevMessages => [...prevMessages, newFileMsg]);
        
        // Clear the file input after sending
        fileInputRef.current.value = '';
      }


      
    }
  };

  const handleTypingIndicator = (username) => {
    if (username !== currentUser) {
      setTypingUsers((prevTypingUsers) => {
        if (!prevTypingUsers.includes(username)) {
          return [...prevTypingUsers, username];
        }
        return prevTypingUsers;
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setTypingUsers((prevTypingUsers) => prevTypingUsers.filter((user) => user !== username));
      }, 3000);
    }
  };

  const handleTyping = () => {
    if (socketRef.current) {
      const typingMsg = {
        action: "typing",
        user: currentUser,
        roomId: user.roomId,
      };
      socketRef.current.send(JSON.stringify(typingMsg));
    }
  };

  const clearTypingIndicator = () => {
    setTypingUsers((prevTypingUsers) => prevTypingUsers.filter((user) => user !== currentUser));
  };

  useEffect(() => {
    setRoomId(user.roomId);
    setMessages(user.chat_room || []);
  }, [user]);

  const selectedUser = user.type === 'DM' ? user.members[0] : null;
  const isSelectedUserOnline = selectedUser ? onlineUsers.includes(selectedUser.username) : false;

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // You can handle file selection logic here
      console.log('Selected file:', file.name);
    }
  };

  return (
    <div>
      <h2 className="chat-header">
        {user.type === 'DM' ? (
          <>
            <img src={selectedUser.image} alt={`${selectedUser.username}'s profile`} />
            {selectedUser.username}
            <span className={isSelectedUserOnline ? 'status online' : 'status offline'}></span>
            {typingUsers.includes(selectedUser.username) && (
              <span className="typing-indicator"> is typing...</span>
            )}
          </>
        ) : (
          <>
            <img src={user.image} alt={`${user.name}'s group pic`} />
            {user.name}
            {typingUsers.length > 0 && (
              <div className="typing-indicator-group">
                {typingUsers.map((username) => (
                  <span key={username} className="typing-indicator">
                    {username} is typing...
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </h2>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${message.sender === currentUser ? 'sent' : 'received'}`}
          >
            <div className="message-header">
              <img 
                src={`${process.env.REACT_APP_BACKEND_API_URL}/media/${message.sender_image}`} 
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
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          placeholder="Type your message..."
        />
        <label className="file-upload-button" htmlFor="fileInput">
          <i className="fa fa-paperclip" aria-hidden="true"></i> Attach File
        </label>
        <input
          id="fileInput"
          ref={fileInputRef}
          type="file"
          className="file-input"
          onChange={handleFileInputChange}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default UserChat;
