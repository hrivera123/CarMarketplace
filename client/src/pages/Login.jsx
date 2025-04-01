// client/src/pages/Login.jsx
import React, { useState, useContext } from 'react';
import { loginUser } from '../api/auth';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      setMessage(data.message); // e.g., "Login successful"
      // Save the logged-in user's data (using id and email as an example)
      login({ id: data.userId, email });
      // Redirect to the view listings page
      navigate('/listings');
    } catch (err) {
      console.error(err);
      if (err.response) {
        setMessage(err.response.data.message || 'Login failed');
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;