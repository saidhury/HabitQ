'use strict';
module.exports = (sequelize, DataTypes) => {
  const HabitCompletion = sequelize.define('HabitCompletion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    habitId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Habits', // Table name for Habits
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE' // If a habit is deleted, delete its completions
    },
    userId: { // Denormalized userId for easier querying of a user's completions
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Table name for Users
        key: 'id'
      },
       onUpdate: 'CASCADE',
       onDelete: 'CASCADE' // If user deleted, delete completions? Or maybe SET NULL? Cascade is simpler.
    },
    completedAt: { // Timestamp when the completion was logged
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW // Defaults to the time of creation
    },
    reflectionText: { // For the simple daily reflection
      type: DataTypes.TEXT,
      allowNull: true
    }
    // createdAt and updatedAt automatically added
  }, {
    tableName: 'HabitCompletions'
  });

  HabitCompletion.associate = function(models) {
    // Define association: A Completion belongs to a Habit
    HabitCompletion.belongsTo(models.Habit, {
      foreignKey: 'habitId',
      as: 'habit'
    });
    // Define association: A Completion belongs to a User
    HabitCompletion.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return HabitCompletion;
};