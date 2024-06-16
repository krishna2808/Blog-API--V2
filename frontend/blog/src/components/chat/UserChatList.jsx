import React, { useState, useEffect } from 'react';
import '../../assets/styles/chat.css' 
import axios from 'axios'; // Import axios for making AJAX requests

function UserChatList({ onSelect }) {
    const currentUser = localStorage.getItem('username');
    const [chats, setChats] = useState([]);
    var token = localStorage.getItem('access_token')
    var url = "http://localhost:8000/chat/chat_message/"

    const [searchResults, setSearchResults] = useState([]);
    const [userList, setUserList] = useState([]);

    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [showNewGroupChatModal, setShowNewGroupChatModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [groupName, setGroupName] = useState('');
    const [selectedGroupUsers, setGroupselectedGroupUsers] = useState([]);
    const [groupImage, setGroupImage] = useState(null);

    var header = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    }

    useEffect(() => {
        if (searchQuery.length >= 3) {
            axios.get(`http://localhost:8000/chat/search_chat_user?query=${searchQuery}`, {
                headers: header,
            })
            .then(response => {
                setSearchResults(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching usernames:', error);
            });
        }
    }, [searchQuery]);

    useEffect(() => {
        axios.get(`http://localhost:8000/chat/search_chat_user`, {
            headers: header,
        })
        .then(response => {
            setUserList(response.data.data);
        })
        .catch(error => {
            console.error('Error fetching usernames:', error);
        });
    }, [showNewGroupChatModal]);

    function chatNewUser(username) {
        var payload = {
            usernames: [username],
            type : "DM"
        }
        axios.post(
            'http://localhost:8000/chat/chat_message/',
            payload,
            {
                headers: header,
            }
        )
        .then(response => {
            setSearchResults(response.data.data);
            window.location.reload();
        })
        .catch(error => {
            console.error('Error fetching usernames:', error);
        });
    }

    const handlerGroupAdd = () => {        
        if (selectedGroupUsers.length > 0 && groupName.length > 0) {
            const formData = new FormData();
            formData.append('name', groupName);
            formData.append('image', groupImage);
            formData.append('usernames', JSON.stringify(selectedGroupUsers));
            var payload = {
                "usernames": selectedGroupUsers,
                "name": groupName,
                "type": "GROUP"
            }

            axios.post(
                'http://localhost:8000/chat/chat_message/',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            )
            .then(response => {
                setSearchResults(response.data.data);
                window.location.reload();
            })
            .catch(error => {
                console.error('Error fetching usernames:', error);
            });
        }
    };

    const handleNewChat = () => {
        setShowNewChatModal(true);
    };
    const handleNewGroupChat = () => {
        setShowNewGroupChatModal(true);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleUserSelect = (username) => {
        setSelectedUser(username);
        chatNewUser(username)
    };

    useEffect(() => {
        fetch(url, {
            method: 'GET',
            headers: header
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            return response.json();
        })
        .then(data => {
            setChats(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);

    return (
        <div>
            <h2>Chats</h2>
            <button onClick={handleNewChat}>New Chat</button>
            {showNewChatModal && (
                <div className="modal">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search username..."
                    />
                    <ul>
                        {Array.isArray(searchResults) && searchResults.map(username => (
                            <li key={username.username} onClick={() => handleUserSelect(username.username)}>{username.username}</li>
                        ))}
                    </ul>
                </div>
            )}

            <button onClick={handleNewGroupChat}>New Group</button>
            {showNewGroupChatModal && (
                <div className="modal">
                    <input
                        id="group-name"
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Group Name"
                    />
                    <select id="selected-users" multiple onChange={(e) => setGroupselectedGroupUsers(Array.from(e.target.selectedOptions, option => option.value))}>
                        {userList.map(username => (
                            <option key={username.username} value={username.username}>
                                {username.username}
                            </option>
                        ))}
                    </select>
                    <button onClick={handlerGroupAdd}>Add Group</button>
                </div>
            )}

            <ul className="chat-list">
                {chats.map((room, index) => (
                    <li key={room.id} onClick={() => onSelect(room)}>
                        <hr className="horizontal-line" />
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
