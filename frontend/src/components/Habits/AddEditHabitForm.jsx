import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { createNewHabit, updateExistingHabit } from '../../store/slices/habitSlice'; // Import actions

// MUI Components
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions'; // Assuming it will be in a Dialog
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
// import FormControl from '@mui/material/FormControl'; // For Select dropdown later
// import InputLabel from '@mui/material/InputLabel';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';

// Initial form state structure matching the model
const initialFormState = {
    name: '',
    description: '',
    frequency: 'daily', // Default to daily for now
    reminderTime: '', // Stored as HH:MM string e.g., "08:30"
};

const AddEditHabitForm = ({ habitToEdit, onClose }) => {
    const dispatch = useDispatch();
    // Use local state to manage form fields
    const [formData, setFormData] = useState(initialFormState);
    const [isEditing, setIsEditing] = useState(false);

    // Select loading/error state from the specific slice if needed for form feedback
    // Or rely on global loading state if that's simpler
    const { isLoading, isError, message } = useSelector(state => state.habits);

    // Populate form if a habit object is passed for editing
    useEffect(() => {
        if (habitToEdit) {
            setFormData({
                name: habitToEdit.name || '',
                description: habitToEdit.description || '',
                frequency: habitToEdit.frequency || 'daily',
                reminderTime: habitToEdit.reminderTime || '',
            });
            setIsEditing(true);
        } else {
            // Reset form if opening for creation or if habitToEdit becomes null
            setFormData(initialFormState);
            setIsEditing(false);
        }
    }, [habitToEdit]); // Re-run effect when habitToEdit changes


    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
        // TODO: Clear backend error message from Redux state if user starts typing?
    };

    // Handle reminder time format potentially (basic for now)
    const handleTimeChange = (event) => {
        // Basic validation could go here (e.g., regex for HH:MM)
        setFormData(prevState => ({
            ...prevState,
            reminderTime: event.target.value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Basic client-side validation
        if (!formData.name.trim()) {
            alert("Habit name cannot be empty."); // Use better feedback later
            return;
        }

        const habitDataPayload = {
            name: formData.name,
            description: formData.description,
            frequency: formData.frequency,
            // Send null if reminderTime is empty, otherwise send the value
            reminderTime: formData.reminderTime || null,
        };

        if (isEditing) {
            // Dispatch update action
            dispatch(updateExistingHabit({ id: habitToEdit.id, habitData: habitDataPayload }))
                .unwrap() // Use unwrap to handle promise result here
                .then(() => {
                    onClose(); // Close the form/modal on success
                })
                .catch((err) => {
                    // Error is already set in Redux state, no need to alert usually
                    console.error("Failed to update habit:", err);
                });
        } else {
            // Dispatch create action
            dispatch(createNewHabit(habitDataPayload))
                 .unwrap()
                 .then(() => {
                    onClose(); // Close the form/modal on success
                 })
                 .catch((err) => {
                    console.error("Failed to create habit:", err);
                 });
        }
    };

    return (
        // Assuming this form is inside a MUI Dialog component
        <Box component="form" onSubmit={handleSubmit}>
            <DialogTitle>{isEditing ? 'Edit Habit' : 'Add New Habit'}</DialogTitle>
            <DialogContent>
                 {isError && message && ( // Display error from Redux state
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {message}
                    </Alert>
                 )}
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="name"
                    name="name"
                    label="Habit Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.name}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="dense"
                    id="description"
                    name="description"
                    label="Description (Optional)"
                    type="text"
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    value={formData.description}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                 {/* Simple Frequency (replace with Select later) */}
                 <TextField
                    margin="dense"
                    id="frequency"
                    name="frequency"
                    label="Frequency"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.frequency}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                    disabled // Keep it daily for now
                 />
                <TextField
                    margin="dense"
                    id="reminderTime"
                    name="reminderTime"
                    label="Reminder Time (HH:MM, 24h format)"
                    type="time" // Use time input type
                    fullWidth
                    variant="outlined"
                    value={formData.reminderTime}
                    onChange={handleTimeChange} // Use specific handler if needed
                    InputLabelProps={{
                      shrink: true, // Keep label floated for time input
                    }}
                    inputProps={{
                      step: 300, // 5 min step (optional)
                    }}
                    sx={{ mb: 2 }}
                />

            </DialogContent>
            <DialogActions sx={{ padding: '16px 24px'}}>
                <Button onClick={onClose} color="inherit" disabled={isLoading}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} /> : (isEditing ? 'Save Changes' : 'Create Habit')}
                </Button>
            </DialogActions>
        </Box>
    );
};

AddEditHabitForm.propTypes = {
  habitToEdit: PropTypes.object, // Habit object if editing, null/undefined if creating
  onClose: PropTypes.func.isRequired, // Function to close the form/modal
};

export default AddEditHabitForm;