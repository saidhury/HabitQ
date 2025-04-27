// backend/routes/habit.routes.js
const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habit.controller');
const { verifyToken } = require('../middleware/authJwt');

// Apply verifyToken middleware to all routes in this file
router.use(verifyToken); // Ensures user is logged in for all habit actions

// GET /api/habits - Get all habits for logged-in user
router.get('/', habitController.getAllHabits);

// POST /api/habits - Create a new habit
router.post('/', habitController.createHabit);

// GET /api/habits/:id - Get a specific habit
router.get('/:id', habitController.getHabitById);

// PUT /api/habits/:id - Update a specific habit
router.put('/:id', habitController.updateHabit);

// DELETE /api/habits/:id - Delete a specific habit
router.delete('/:id', habitController.deleteHabit);

// POST /api/habits/:id/complete - Mark a habit as completed for today/period
router.post('/:id/complete', habitController.completeHabit); // Keep commented for now

// GET /api/habits/stats - Get stats for logged-in user
router.get('/stats', habitController.getHabitStats); // Keep commented for now

module.exports = router;