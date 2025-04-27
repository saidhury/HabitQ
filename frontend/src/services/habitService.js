// frontend/src/services/habitService.js
import api from './api'; // Your configured axios instance

const API_ENDPOINT = '/habits'; // Base endpoint for habits

// Get all habits for the logged-in user
const getAllHabits = async () => {
    const response = await api.get(API_ENDPOINT);
    return response.data; // Returns the array of habits
};

// Create a new habit
// habitData should be an object like { name, description, frequency, reminderTime }
const createHabit = async (habitData) => {
    const response = await api.post(API_ENDPOINT, habitData);
    return response.data; // Returns the newly created habit object
};

// Get a single habit by its ID
const getHabitById = async (id) => {
    const response = await api.get(`${API_ENDPOINT}/${id}`);
    return response.data; // Returns the specific habit object
};

// Update an existing habit
// habitData should contain the fields to update
const updateHabit = async (id, habitData) => {
    const response = await api.put(`${API_ENDPOINT}/${id}`, habitData);
    return response.data; // Returns the updated habit object
};

// Delete a habit by its ID
const deleteHabit = async (id) => {
    const response = await api.delete(`${API_ENDPOINT}/${id}`);
    // DELETE often returns 200 with message or 204 No Content
    // We might just return the id or a success status/message
    return { id: id, message: response.data?.message || 'Habit deleted successfully' };
    // Or if 204: return { id: id, message: 'Habit deleted successfully' };
};

const getStats = async () => {
    // The endpoint path might be '/stats' relative to base URL or '/habits/stats'
    // Based on your controller/routes, it seems to be '/habits/stats'
    const response = await api.get(`${API_ENDPOINT}/stats`);
    return response.data; // Expects { totalHabits, habitsWithActiveStreak, etc. }
};

// --- Placeholder for completing a habit ---
// const completeHabit = async (id, reflectionData = {}) => {
//     const response = await api.post(`${API_ENDPOINT}/${id}/complete`, reflectionData);
//     return response.data; // Should return updated habit/user stats
// };


const habitService = {
    getAllHabits,
    createHabit,
    getHabitById,
    updateHabit,
    deleteHabit,
    // completeHabit, // Add later
    getStats,
};

export default habitService;