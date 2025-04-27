// frontend/src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Adjust the path based on the actual location relative to slices folder
// It should likely be '../../services/authService' if authService.js is in src/services
import authService from '../../services/authService';

// Get user/token from localStorage if available
let storedUser = null;
let storedToken = null;
try {
    storedUser = JSON.parse(localStorage.getItem('user'));
    storedToken = localStorage.getItem('token');
} catch (e) {
    console.error("Error parsing user from localStorage", e);
    localStorage.removeItem('user'); // Clear corrupted data
    localStorage.removeItem('token');
}


const initialState = {
  user: storedUser ? storedUser : null,
  token: storedToken ? storedToken : null,
  isAuthenticated: storedToken ? true : false,
  isLoading: false, // Represents loading state for auth operations
  isError: false,
  message: '',
};

// --- Async Thunks ---

// Register
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      // Assuming authService.register returns { message, user } (without token)
      return await authService.register(userData);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login
export const login = createAsyncThunk(
    'auth/login',
    async (userData, thunkAPI) => {
      try {
        // Expecting { user: { ... }, accessToken: '...' } from backend
        const data = await authService.login(userData);
        return data;
      } catch (error) {
        const message =
         (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
      }
    }
  );

// Logout - doesn't need to be async thunk if just clearing local state/storage
// export const logout = createAsyncThunk('auth/logout', async () => {
//   authService.logout(); // Clears localStorage
// });


// --- Slice Definition ---
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Simple reducer for logout action
    logout: (state) => {
        authService.logout(); // Clear local storage
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.isError = false;
        state.message = '';
    },
    // Reset helper action
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
      // Do NOT reset user/token/isAuthenticated here, only loading/error/message
    },
  },
  extraReducers: (builder) => {
    builder
      // Register Cases
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.message = '';
        state.isError = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        // Don't log in user here, just report success. Login page will handle login.
        state.message = action.payload.message || 'Registration successful! Please login.';
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; // error message from rejectWithValue
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Login Cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.message = '';
        state.isError = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Logout cases not needed here if using simple reducer action above
      // .addCase(logout.fulfilled, (state) => { // If using async thunk for logout
      //   state.user = null;
      //   state.token = null;
      //   state.isAuthenticated = false;
      // });
  },
});

// Export the simple actions (logout, reset) and the reducer
export const { logout, reset } = authSlice.actions;
export default authSlice.reducer;