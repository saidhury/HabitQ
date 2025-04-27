'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
// Determine environment (default to development)
const env = process.env.NODE_ENV || 'development';
// Load the config for the current environment
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
// Initialize Sequelize instance based on config
if (config.use_env_variable) {
  // For production environments using DATABASE_URL (like Heroku)
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // For local development using individual DB parameters
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Load all model files from the current directory
fs
  .readdirSync(__dirname)
  .filter(file => {
    // Filter out non-JS files, the index file itself, and test files
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    // Import model definition
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model; // Add model to the db object
  });

// Set up associations between models if defined
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export the sequelize instance and the models object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;