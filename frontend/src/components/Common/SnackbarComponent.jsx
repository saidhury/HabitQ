// frontend/src/components/Common/SnackbarComponent.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
// Ensure this path is correct relative to SnackbarComponent.jsx
import { hideSnackbar } from '../../store/slices/uiSlice';

function SnackbarComponent() {
    const dispatch = useDispatch();
    // Select the state from the ui slice
    const { snackbarOpen, snackbarMessage, snackbarSeverity } = useSelector((state) => state.ui);

    const handleClose = (event, reason) => {
        // Prevent closing on click away if desired
        if (reason === 'clickaway') {
            return;
        }
        // Dispatch action to hide the snackbar
        dispatch(hideSnackbar());
    };

    // Make sure message is not null/undefined before rendering Alert
    if (!snackbarMessage) {
        return null;
    }

    return (
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000} // Adjust duration as needed (milliseconds)
            onClose={handleClose}
            // Position the snackbar (bottom-center is common)
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            {/* Use Alert component for styled messages */}
            {/* Important: Conditionally render Alert or use key to reset transition */}
            <Alert
                onClose={handleClose} // Add close button to the Alert itself
                severity={snackbarSeverity || 'info'} // Default to 'info' if severity is missing
                variant="filled" // Filled variant often looks better for Snackbars
                sx={{ width: '100%' }}
            >
                {snackbarMessage}
            </Alert>
        </Snackbar>
    );
}

export default SnackbarComponent;