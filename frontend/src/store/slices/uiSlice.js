// frontend/src/store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    snackbarOpen: false,
    snackbarMessage: '',
    snackbarSeverity: 'info', // 'success', 'error', 'warning', 'info'
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        // Action to show the snackbar
        showSnackbar: (state, action) => {
            state.snackbarOpen = true;
            // Payload should be { message: string, severity?: 'success'|'error'|'warning'|'info' }
            state.snackbarMessage = action.payload.message;
            state.snackbarSeverity = action.payload.severity || 'info';
        },
        // Action to hide the snackbar
        hideSnackbar: (state) => {
            state.snackbarOpen = false;
            // Reset message/severity when hiding for cleanliness (optional)
            // state.snackbarMessage = '';
            // state.snackbarSeverity = 'info';
        },
    },
});

// Export actions
export const { showSnackbar, hideSnackbar } = uiSlice.actions;

// Export reducer
export default uiSlice.reducer;