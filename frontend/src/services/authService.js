// frontend/src/services/authService.js
import api from './api'; // Import the configured Axios instance

// Register user
const register = async (userData) => {
  // userData should contain { username, email, password }
  const response = await api.post('/auth/register', userData);
  // The backend currently just sends a message and user object (without token)
  return response.data;
};

// Login user
const login = async (userData) => {
  // userData should contain { email, password }
  const response = await api.post('/auth/login', userData);
  // Expecting { user: { ... }, accessToken: '...' } from backend
  if (response.data.accessToken) {
    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

// Logout user (just clears local storage)
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;