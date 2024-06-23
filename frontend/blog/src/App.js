import React from 'react';
// import { Route, Switch } from 'react-router-dom';
import { BrowserRouter , Router, Route, Routes } from 'react-router-dom';

import SignIn from './components/account/SignIn';
import ChatApp from './components/chat/ChatApp';
import Dashboard from './components/post/Dashboard';
import UserDetails from './components/post/UserDetails';
import Profile from './components/account/Profile';
import CreatePost from './components/post/CreatePost';
import MyNetwork from './components/post/MyNetwork';
import Logout from './components/account/Logout';
import SignUp from './components/account/SignUp';



function App() {
	return (
        <div className='container'>
            <BrowserRouter> 
                <Routes>
                {/* <Route path="/" exact element={<Dashboard/>} /> */}
                <Route path="/" element={<SignIn/>} />
                <Route path="/sign-in" element={<SignIn/>} />
                <Route path="/sign-up" element={<SignUp/>} />
                <Route path="/chat" element={<ChatApp/>} />
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/user-profile" element={<UserDetails/>} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/create-post" element={<CreatePost/>} />
                <Route path="/my-network" element={<MyNetwork/>} />
                <Route path="/logout" element={<Logout/>} />

                </Routes>
            </BrowserRouter>	
        </div>  

	
	);
};

export default App;
