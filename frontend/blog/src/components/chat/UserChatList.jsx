import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/styles/chat.css';

function UserChatList({ onSelect }) {
  const [chats, setChats] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showNewGroupChatModal, setShowNewGroupChatModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userList, setUserList] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);

  const token = localStorage.getItem('access_token');
  const url = "http://localhost:8000/chat/chat_message/";
  const header = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  useEffect(() => {
    if (searchQuery.length >= 3) {
      axios.get(`http://localhost:8000/chat/search_chat_user?query=${searchQuery}`, { headers: header })
        .then(response => setSearchResults(response.data.data))
        .catch(error => console.error('Error fetching usernames:', error));
    }
  }, [searchQuery]);

  useEffect(() => {
    axios.get(`http://localhost:8000/chat/search_chat_user`, { headers: header })
      .then(response => setUserList(response.data.data))
      .catch(error => console.error('Error fetching usernames:', error));
  }, [showNewGroupChatModal]);

  useEffect(() => {
    fetch(url, {
      method: 'GET',
      headers: header
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch data');
        return response.json();
      })
      .then(data => setChats(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const chatNewUser = (username) => {
    const payload = { usernames: [username], type: "DM" };
    axios.post(url, payload, { headers: header })
      .then(response => {
        setSearchResults(response.data.data);
        window.location.reload();
      })
      .catch(error => console.error('Error fetching usernames:', error));
  };

  const handleGroupAdd = () => {
    if (selectedGroupUsers.length > 0 && groupName.length > 0) {
      const payload = { usernames: selectedGroupUsers, name: groupName, type: "GROUP" };
      axios.post(url, payload, { headers: header })
        .then(response => {
          setSearchResults(response.data.data);
          window.location.reload();
        })
        .catch(error => console.error('Error fetching usernames:', error));
    }
  };

  return (
    <div>
      <h2>Chats</h2>
      <Button onClick={() => setShowNewChatModal(true)}>New Chat</Button>
      <Modal show={showNewChatModal} onHide={() => setShowNewChatModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search username..."
          />
          <ListGroup>
            {searchResults.map(username => (
              <ListGroup.Item key={username.username} onClick={() => chatNewUser(username.username)}>
                {username.username}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>

      <Button onClick={() => setShowNewGroupChatModal(true)}>New Group</Button>
      <Modal show={showNewGroupChatModal} onHide={() => setShowNewGroupChatModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New Group Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group Name"
          />
          <Form.Control
            as="select"
            multiple
            onChange={(e) => setSelectedGroupUsers(Array.from(e.target.selectedOptions, option => option.value))}
          >
            {userList.map(username => (
              <option key={username.username} value={username.username}>
                {username.username}
              </option>
            ))}
          </Form.Control>
          <Button onClick={handleGroupAdd}>Add Group</Button>
        </Modal.Body>
      </Modal>

      <ul className="chat-list">
        {chats.map((room) => (
          <li key={room.id} onClick={() => onSelect(room)}>
            {room.type === 'DM' ? (
              <div className="dm-chat-item">
                <img
                  src={room.members[0].image}
                  alt={`${room.members[0].username}'s profile`}
                  className="dm-chat-pic"
                />
                <span>{room.members[0].username}</span>
              </div>
            ) : (
              <div className="dm-chat-item">
                <img
                  src={room.image}
                  alt={`${room.name}'s group`}
                  className="dm-chat-pic"
                />
                <span>{room.name}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserChatList;
