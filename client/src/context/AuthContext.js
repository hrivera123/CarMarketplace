// client/src/context/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to log in and set the user object
  const login = (userData) => {
    setUser(userData);
    // Optionally, persist userData (e.g., in localStorage)
    // localStorage.setItem('user', JSON.stringify(userData));
  };

  // Function to log out the user
  const logout = () => {
    setUser(null);
    // localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};