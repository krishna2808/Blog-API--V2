import React from 'react';
// import { Route, Switch } from 'react-router-dom';
import { BrowserRouter , Router, Route, Routes } from 'react-router-dom';
// import Home from './components/Home';
// import About from './components/About';
// import Navigation from './components/Navigation';
// import Dashboard from './product/Dashboard';
import SignIn from './components/account/SignIn';
import ChatApp from './components/chat/ChatApp';
import Dashboard from './components/post/Dashboard';
import UserDetails from './components/post/UserDetails';
import Profile from './components/account/Profile';
import CreatePost from './components/post/CreatePost';
import MyNetwork from './components/post/MyNetwork';

// import SignUp from './account/SignUp';
// import ForgotPassword from './account/ForgotPassword';
// import Profile from './account/Profile';
// import Cart from './product/Cart';
// import SignOut from './account/SignOut';
// import SingleItem from './product/SingleItem'


function App() {
	return (
		<div className='container'>
		<BrowserRouter> 
		  <Routes>
			{/* <Route path="/" exact element={<Dashboard/>} /> */}
			<Route path="/" element={<SignIn/>} />
			<Route path="/chat" element={<ChatApp/>} />
			<Route path="/dashboard" element={<Dashboard/>} />
			<Route path="/user-profile" element={<UserDetails/>} />
			<Route path="/profile" element={<Profile/>} />
			<Route path="/create-post" element={<CreatePost/>} />
			<Route path="/my-network" element={<MyNetwork/>} />

			{/* <Route path="/sign-out" element={<SignOut/>} />
			<Route path="/sign-up" element={<SignUp/>} />
			<Route path="/profile" element={<Profile/>} />
			<Route path="/cart" element={<Cart/>} />
			<Route path="/singleitem" element={<SingleItem/>} />
			<Route path="/forgot-password" element={<ForgotPassword/>} /> */}
		  </Routes>
		</BrowserRouter>	
		</div>  

	
	);
};

export default App;
