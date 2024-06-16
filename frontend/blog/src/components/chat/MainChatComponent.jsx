import React, { useState } from 'react';
import UserChat from './UserChat';
import UserChatList from './UserChatList';
import '../../assets/styles/chat.css';

function MainChatComponent() {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="chat-container">
      <div className="left-panel">
        <UserChatList onSelect={handleUserSelect} />
      </div>
      <div className="right-panel">
        {selectedUser ? (
          <UserChat user={selectedUser} />
        ) : (
          <div className="placeholder">
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainChatComponent;
