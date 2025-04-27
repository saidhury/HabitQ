'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Habits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { // Foreign Key constraint
          model: 'Users', // Name of the Users table
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      frequency: {
        type: Sequelize.ENUM('daily'), // Match your model definition
        allowNull: false,
        defaultValue: 'daily'
      },
      reminderTime: {
        type: Sequelize.STRING(5),
        allowNull: true
      },
      currentStreak: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      longestStreak: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      lastCompletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
    // Add index for faster lookups on the foreign key
    await queryInterface.addIndex('Habits', ['userId']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Habits');
  }
};