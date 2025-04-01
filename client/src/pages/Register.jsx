// client/src/pages/Register.jsx
import React, { useState } from 'react';
import { registerUser } from '../api/auth';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(email, password);
      setMessage(data.message); // "User registered successfully"
    } catch (err) {
      console.error(err);
      if (err.response) {
        setMessage(err.response.data.message || 'Registration failed');
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
