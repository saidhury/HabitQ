// frontend/src/store/slices/habitSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import habitService from '../../services/habitService';

const initialState = {
    habits: [], // Array to store user's habits
    isLoading: false,
    isError: false,
    message: '',
    // You might add state for a single selected habit if needed for editing
    // selectedHabit: null,
};

// Async Thunk: Get all habits for the user
export const fetchHabits = createAsyncThunk(
    'habits/fetchAll',
    async (_, thunkAPI) => { // Use _ if the first arg (payload) isn't needed
        try {
            // The token should be automatically included by the axios interceptor
            return await habitService.getAllHabits();
        } catch (error) {
            const message =
                (error.response?.data?.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Async Thunk: Create a new habit
export const createNewHabit = createAsyncThunk(
    'habits/create',
    async (habitData, thunkAPI) => {
        try {
            return await habitService.createHabit(habitData);
        } catch (error) {
             const message =
                (error.response?.data?.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Async Thunk: Update a habit
export const updateExistingHabit = createAsyncThunk(
    'habits/update',
    async ({ id, habitData }, thunkAPI) => { // Expect an object with id and data
        try {
            return await habitService.updateHabit(id, habitData);
        } catch (error) {
             const message =
                (error.response?.data?.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Async Thunk: Delete a habit
export const deleteUserHabit = createAsyncThunk(
    'habits/delete',
    async (id, thunkAPI) => { // Expect just the id
        try {
            // The service currently returns { id, message }, we only need the id for the reducer
            await habitService.deleteHabit(id);
            return id; // Return the id of the deleted habit
        } catch (error) {
             const message =
                (error.response?.data?.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const habitSlice = createSlice({
    name: 'habits',
    initialState,
    reducers: {
        resetHabitState: (state) => initialState, // Action to reset state if needed (e.g., on logout)
        // Add other simple reducers if needed
    },
    extraReducers: (builder) => {
        builder
            // Fetch Habits
            .addCase(fetchHabits.pending, (state) => {
                state.isLoading = true;
                state.message = ''; // Clear previous messages
                state.isError = false;
            })
            .addCase(fetchHabits.fulfilled, (state, action) => {
                state.isLoading = false;
                state.habits = action.payload; // Set habits from API response
            })
            .addCase(fetchHabits.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Create Habit
            .addCase(createNewHabit.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createNewHabit.fulfilled, (state, action) => {
                state.isLoading = false;
                // Add the new habit to the start or end of the list
                state.habits.push(action.payload);
                state.message = 'Habit created successfully!'; // Optional success message
            })
            .addCase(createNewHabit.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
             // Update Habit
            .addCase(updateExistingHabit.pending, (state) => {
                state.isLoading = true; // Could set a specific 'isUpdating' flag
            })
            .addCase(updateExistingHabit.fulfilled, (state, action) => {
                state.isLoading = false;
                // Find the habit in the array and update it
                const index = state.habits.findIndex(h => h.id === action.payload.id);
                if (index !== -1) {
                    state.habits[index] = action.payload;
                }
                 state.message = 'Habit updated successfully!';
            })
            .addCase(updateExistingHabit.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Delete Habit
            .addCase(deleteUserHabit.pending, (state) => {
                state.isLoading = true; // Could set a specific 'isDeleting' flag
            })
            .addCase(deleteUserHabit.fulfilled, (state, action) => {
                state.isLoading = false;
                // Filter out the deleted habit using the id returned by the thunk
                state.habits = state.habits.filter(h => h.id !== action.payload);
                state.message = 'Habit deleted successfully!';
            })
            .addCase(deleteUserHabit.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { resetHabitState } = habitSlice.actions;
export default habitSlice.reducer;