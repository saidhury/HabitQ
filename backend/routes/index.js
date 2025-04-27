const express = require('express');
const router = express.Router();

// Import route handlers
const authRoutes = require('./auth.routes');
const habitRoutes = require('./habit.routes');
// const userRoutes = require('./user.routes'); // For profile, friends later
// const badgeRoutes = require('./badge.routes'); // Later
// const challengeRoutes = require('./challenge.routes'); // Later
// const notificationRoutes = require('./notification.routes'); // Later

// Mount route handlers
router.use('/auth', authRoutes);
router.use('/habits', habitRoutes); // Add habit routes
// router.use('/users', userRoutes);
// router.use('/badges', badgeRoutes);
// router.use('/challenges', challengeRoutes);
// router.use('/notifications', notificationRoutes);

module.exports = router;