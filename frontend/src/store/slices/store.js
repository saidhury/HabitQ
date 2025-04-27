// frontend/src/store/slices/store.js (or ../store.js)
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import habitReducer from './habitSlice';
import uiReducer from './uiSlice';
import statsReducer from './statsSlice'; // <-- Import stats reducer

const store = configureStore({
  reducer: {
    auth: authReducer,
    habits: habitReducer,
    ui: uiReducer,
    stats: statsReducer, // <-- Add stats reducer
  },
});

export default store;