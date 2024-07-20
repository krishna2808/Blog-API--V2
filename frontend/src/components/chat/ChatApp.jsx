import React, { useState } from 'react';
import '../../assets/styles/chat.css';

import UserChatList from './UserChatList';
import UserChat from './UserChat';
import Header from '../common/Header';


function App() {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  return (
    <>
    
        <Header />
    
        <div className="app-container">
        <div className="user-chat-list">
            <UserChatList onSelect={handleUserSelect} />
        </div>
        <div className="user-chat">
            {selectedUser ? <UserChat user={selectedUser} /> : <div className='select-chat'>Select a chat to start messaging</div>}
        </div>
        </div>



    </>
   
  );
}

export default App;
