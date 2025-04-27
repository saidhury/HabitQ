// frontend/src/store/slices/statsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import habitService from '../../services/habitService'; // Adjust path if needed
import { showSnackbar } from './uiSlice'; // To show errors

const initialState = {
    statsData: { // Store the fetched stats here
        totalHabits: 0,
        habitsWithActiveStreak: 0,
        longestStreakEver: 0,
        totalCompletionsAllTime: 0,
        // Add keys for any other stats your API might return
    },
    isLoading: false,
    isError: false,
    message: '',
};

// Async Thunk: Fetch user statistics
export const fetchStats = createAsyncThunk(
    'stats/fetch',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const data = await habitService.getStats();
            return data;
        } catch (error) {
            const message =
                (error.response?.data?.message) || error.message || error.toString();
            dispatch(showSnackbar({ message: `Error fetching stats: ${message}`, severity: 'error' }));
            return rejectWithValue(message);
        }
    }
);

export const statsSlice = createSlice({
    name: 'stats',
    initialState,
    reducers: {
        resetStatsState: (state) => initialState, // For logout
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStats.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = '';
            })
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.statsData = action.payload; // Update state with fetched data
            })
            .addCase(fetchStats.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                 // Optionally reset statsData on error or keep stale data
                // state.statsData = initialState.statsData;
            });
    },
});

export const { resetStatsState } = statsSlice.actions;
export default statsSlice.reducer;