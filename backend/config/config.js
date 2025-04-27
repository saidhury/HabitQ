// backend/config/config.json
require('dotenv').config(); // Ensure dotenv is loaded here too for CLI usage

module.exports = {
  development: {
    username: process.env.DB_USER,     // <-- Reads from .env
    password: process.env.DB_PASSWORD, // <-- Reads from .env
    database: process.env.DB_NAME,     // <-- Reads from .env
    host: process.env.DB_HOST,         // <-- Reads from .env
    port: process.env.DB_PORT || 3306, // <-- Reads from .env (optional fallback)
    dialect: "mysql"
  },
  test: {
    // ... your test config using process.env ...
    username: process.env.DB_USER_TEST,
    password: process.env.DB_PASSWORD_TEST,
    database: process.env.DB_NAME_TEST,
    host: process.env.DB_HOST_TEST,
    port: process.env.DB_PORT_TEST || 3306,
    dialect: "mysql",
    logging: false
  },
  production: {
    username: process.env.DB_USER_PROD,
    password: process.env.DB_PASSWORD_PROD,
    database: process.env.DB_NAME_PROD,
    host: process.env.DB_HOST_PROD,
    port: process.env.DB_PORT_PROD || 5432, // Default Postgres port
    dialect: "postgres", // <--- CHANGE THIS
    logging: false,
    dialectOptions: { // <-- ADD THIS
      ssl: {
        require: true,
        rejectUnauthorized: false // Necessary for Render connection
      }
    }
  }
};