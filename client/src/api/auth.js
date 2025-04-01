// client/src/api/auth.js
import axios from 'axios';

// Our backend base URL (adjust if needed)
const BASE_URL = 'http://localhost:5000/api';

/**
 * Registers a new user
 */
export async function registerUser(email, password) {
  // POST /api/auth/register
  const response = await axios.post(`${BASE_URL}/auth/register`, {
    email,
    password,
  });
  return response.data; // should have { message: "User registered successfully" }
}

/**
 * Logs in an existing user
 */
export async function loginUser(email, password) {
  // POST /api/auth/login
  const response = await axios.post(`${BASE_URL}/auth/login`, {
    email,
    password,
  });
  return response.data; // { message: "Login successful", userId: <id> }
}
