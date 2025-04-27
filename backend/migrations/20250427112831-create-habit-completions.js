'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HabitCompletions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      habitId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { // Foreign Key constraint
          model: 'Habits', // Name of the Habits table
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      completedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') // Default to now
      },
      reflectionText: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
     // Add indexes for faster lookups
    await queryInterface.addIndex('HabitCompletions', ['habitId']);
    await queryInterface.addIndex('HabitCompletions', ['userId']);
    await queryInterface.addIndex('HabitCompletions', ['completedAt']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('HabitCompletions');
  }
};