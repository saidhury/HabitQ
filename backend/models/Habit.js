'use strict';
module.exports = (sequelize, DataTypes) => {
  const Habit = sequelize.define('Habit', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { // Define foreign key relationship
        model: 'Users', // This is the table name Sequelize creates (pluralized)
        key: 'id'
      },
      onUpdate: 'CASCADE', // Optional: What happens if the referenced User ID changes
      onDelete: 'CASCADE'  // Optional: What happens if the referenced User is deleted
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    // Basic frequency for Phase 1
    frequency: {
      type: DataTypes.ENUM('daily'), // Start simple, can expand later ('weekly', 'specific_days')
      allowNull: false,
      defaultValue: 'daily'
    },
    // Store reminder time as simple string HH:MM (24-hour format) for Phase 1
    reminderTime: {
      type: DataTypes.STRING(5), // e.g., "08:30", "17:00"
      allowNull: true
    },
    // Simple streak tracking directly on the habit
    currentStreak: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    longestStreak: {
       type: DataTypes.INTEGER,
       allowNull: false,
       defaultValue: 0
    },
    lastCompletedAt: { // Track the timestamp of the last completion for streak logic
       type: DataTypes.DATE,
       allowNull: true
    }
    // Timestamps `createdAt` and `updatedAt` are added automatically by default
  }, {
    // Model options
    tableName: 'Habits' // Explicitly define table name if needed (Sequelize usually pluralizes)
  });

  Habit.associate = function(models) {
    // Define association: A Habit belongs to a User
    Habit.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user' // Alias to use when querying, e.g., Habit.findOne({ include: 'user' })
    });
    // Define association: A Habit has many Completions
    Habit.hasMany(models.HabitCompletion, {
      foreignKey: 'habitId',
      as: 'completions' // Alias, e.g., Habit.findOne({ include: 'completions' })
    });
  };

  return Habit;
};