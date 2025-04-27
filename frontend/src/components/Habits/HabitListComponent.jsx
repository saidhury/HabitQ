import React from 'react';
import PropTypes from 'prop-types';
import HabitItemComponent from './HabitItemComponent'; // Import the item component

// MUI Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'; // Optional: for layout

const HabitListComponent = ({ habits, onEditHabit, onCompleteHabit }) => {
    if (!habits || habits.length === 0) {
        return (
            <Typography sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}>
                No habits created yet. Add your first habit to get started!
            </Typography>
        );
    }

    return (
        <Box sx={{ mt: 3 }}>
            {/* Option 1: Simple List */}
             {/* {habits.map((habit) => (
                <HabitItemComponent
                    key={habit.id}
                    habit={habit}
                    onEdit={onEditHabit}
                    onComplete={onCompleteHabit}
                />
            ))} */}

             {/* Option 2: Grid Layout (adjust breakpoints as needed) */}
            <Grid container spacing={2}>
                {habits.map((habit) => (
                    <Grid item xs={12} sm={6} md={4} key={habit.id}>
                         <HabitItemComponent
                            habit={habit}
                            onEdit={onEditHabit}
                            onComplete={onCompleteHabit}
                         />
                    </Grid>
                 ))}
             </Grid>
        </Box>
    );
};

HabitListComponent.propTypes = {
  habits: PropTypes.arrayOf(PropTypes.object).isRequired, // Expects an array of objects
  onEditHabit: PropTypes.func.isRequired, // Function passed down to handle edit clicks
  onCompleteHabit: PropTypes.func.isRequired, // Function passed down for completion
};

export default HabitListComponent;