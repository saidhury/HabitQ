// frontend/src/services/api.js
import axios from 'axios';

// Use Vite's way to access environment variables
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    console.error("Error: VITE_API_URL is not defined in .env file.");
    // You might want to throw an error or provide a default fallback for safety
    // throw new Error("VITE_API_URL is not defined.");
}

console.log("API Service using Base URL:", API_URL); // For debugging

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token
api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token'); // Or get from Redux state if preferred
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

// Optional: Response interceptor to handle common errors (like 401 Unauthorized)
api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized or Token Expired:", error.response.data?.message || 'No specific error message.');
        // Clear local storage on auth failure
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        // Redirect to login - Use navigate hook in components or dispatch logout action for better practice
        // window.location.href = '/login';
        // Ideally, dispatch a logout action here if store is accessible or handle in the calling code (thunks)
      }
      return Promise.reject(error); // Important to re-reject the error
    }
  );


export default api;