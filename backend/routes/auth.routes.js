const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/authJwt'); // Assuming you create this middleware

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/me (Example protected route to get user info)
// router.get('/me', verifyToken, authController.getMe);

module.exports = router;