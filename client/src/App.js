// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Listings from './pages/Listings';
import NewListing from './pages/NewListing';
import ListingDetails from './pages/ListingDetails'; // Import the new component
import './App.css';
import ChatBot from './Chatbot.js';

function App() {
  return (
    <AuthProvider>
      <Router>
        <header className="header">
          <img src="/pagelogo.png" alt="Logo" className="logo" />
        </header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/listings">View Listings</Link>
          <Link to="/listings/new">Create Listing</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<h2>Home Page</h2>} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/listings/new" element={<NewListing />} />
            <Route path="/listings/:id" element={<ListingDetails />} />
          </Routes>
        </main>
        <ChatBot /> {/* Add the chatbot component here */}
      </Router>
    </AuthProvider>
  );
}

export default App;