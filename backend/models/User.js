'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    xp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    avatarState: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'default' // e.g., 'default', 'bronze_tier', 'custom_1'
    }
    // Add pushSubscription field later for notifications
    // pushSubscription: {
    //   type: DataTypes.JSON, // Store the subscription object
    //   allowNull: true
    // }
  }, {
    // Model options
    timestamps: true, // Add createdAt and updatedAt fields
    hooks: {
      // Hash password before saving
      beforeCreate: async (user) => {
        if (user.passwordHash) {
          const salt = await bcrypt.genSalt(10);
          user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
        }
      },
      beforeUpdate: async (user) => {
         // Hash password only if it has been changed
        if (user.changed('passwordHash') && user.passwordHash) {
           const salt = await bcrypt.genSalt(10);
           user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
        }
      }
    }
  });

  // Instance method to compare password
  User.prototype.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.passwordHash);
  };

  // Define associations here (later)
  User.associate = (models) => {
    // User has many Habits
    User.hasMany(models.Habit, {
      foreignKey: 'userId',
      as: 'habits' // Alias, e.g., User.findOne({ include: 'habits' })
    });
    // User has many HabitCompletions
    User.hasMany(models.HabitCompletion, {
      foreignKey: 'userId',
      as: 'completions' // Alias, e.g., User.findOne({ include: 'completions' })
    });
  };

  return User;
};