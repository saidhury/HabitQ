require('dotenv').config(); // Load environment variables first
const express = require('express');
const cors = require('cors');
const db = require('./models'); // Sequelize instance and models
const routes = require('./routes'); // API routes index
// const { setupCronJobs } = require('./services/cron.service'); // For reminders later

const app = express();

// --- Middleware ---
// Enable CORS for frontend access (adjust origin in production)
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
// Parse JSON request bodies
app.use(express.json());
// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.get('/', (req, res) => {
  res.send('HabitQuest API is running!');
});
app.use('/api', routes); // Mount all API routes under /api

// --- Database Sync & Server Start ---
const PORT = process.env.PORT || 5000;

// Sync database (consider using migrations for production)
// Use { force: true } only in dev to drop and recreate tables
db.sequelize.sync({ force: false }).then(() => {
  console.log('Database connected and synchronized.');
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    // Start cron jobs after server is ready
    // setupCronJobs();
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

// --- Basic Error Handling (Placeholder) ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: err.message || 'Something broke!' });
});