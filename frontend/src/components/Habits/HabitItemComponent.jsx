import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { deleteUserHabit } from '../../store/slices/habitSlice'; // Import delete action

// MUI Components
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // For complete button
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'; // If reminder is set
import WhatshotIcon from '@mui/icons-material/Whatshot'; // For streak

const HabitItemComponent = ({ habit, onEdit, onComplete }) => {
    const dispatch = useDispatch();

    const handleDelete = () => {
        // Add confirmation dialog later if desired
        if (window.confirm(`Are you sure you want to delete the habit "${habit.name}"?`)) {
            dispatch(deleteUserHabit(habit.id));
        }
    };

    // Placeholder for completion logic (call passed function)
    const handleComplete = () => {
        // This will trigger the completion logic defined in DashboardPage or HabitList
        // For now, it just calls the prop. Later it might pass reflection text.
        if (onComplete) {
            onComplete(habit.id);
        }
        console.log("Complete button clicked for habit:", habit.id);
        // TODO: Implement actual completion logic (dispatch action, update UI)
    };

    // Placeholder for edit logic (call passed function)
     const handleEdit = () => {
        if (onEdit) {
            onEdit(habit); // Pass the whole habit object to the edit handler
        }
         console.log("Edit button clicked for habit:", habit.id);
    };


    return (
        <Card sx={{
            mb: 2,
            // Example: Add slight hover effect
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
               transform: 'translateY(-2px)',
               boxShadow: '0px 8px 20px rgba(0,0,0,0.15)', // Enhanced shadow on hover
             }
         }}>
            <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                    {habit.name}
                </Typography>
                {habit.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {habit.description}
                    </Typography>
                )}
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Chip label={habit.frequency || 'Daily'} size="small" variant="outlined" />
                    {habit.reminderTime && (
                         <Chip
                            icon={<NotificationsActiveIcon fontSize="small" />}
                            label={habit.reminderTime}
                            size="small"
                            variant="outlined"
                            color="info"
                         />
                    )}
                     <Chip
                        icon={<WhatshotIcon fontSize="small" />}
                        label={`Streak: ${habit.currentStreak || 0}`}
                        size="small"
                        variant="outlined"
                        color={habit.currentStreak > 0 ? "warning" : "default"}
                    />
                     {/* Add longest streak if desired */}
                     {/* <Chip label={`Best: ${habit.longestStreak || 0}`} size="small" /> */}
                </Stack>
            </CardContent>
            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                 {/* Left side actions: Edit/Delete */}
                <Box>
                    <IconButton aria-label="edit" size="small" onClick={handleEdit}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton aria-label="delete" size="small" onClick={handleDelete} sx={{ color: 'error.main' }}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
                {/* Right side action: Complete */}
                {/* TODO: Add logic to disable/change appearance if already completed today */}
                <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<CheckCircleOutlineIcon />}
                    onClick={handleComplete}
                >
                    Complete Today
                </Button>
            </CardActions>
        </Card>
    );
};

// Define prop types for type checking (optional but good practice)
HabitItemComponent.propTypes = {
  habit: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    frequency: PropTypes.string,
    reminderTime: PropTypes.string,
    currentStreak: PropTypes.number,
    longestStreak: PropTypes.number,
    // Add other expected properties if needed
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired, // Function to handle completion click
};

export default HabitItemComponent;