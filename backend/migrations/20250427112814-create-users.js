'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', { // Ensure table name matches what Sequelize expects
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: { // Validation is usually model-level, but adding constraint is good
          isEmail: true
        }
      },
      passwordHash: {
        type: Sequelize.STRING,
        allowNull: false
      },
      xp: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      avatarState: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'default'
      },
      createdAt: { // Sequelize manages these automatically if timestamps: true
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW // Explicit default
      },
      updatedAt: { // Sequelize manages these automatically if timestamps: true
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW // Explicit default
      }
    });
    // Add unique constraints separately if needed (though handled by column defs above)
    // await queryInterface.addConstraint('Users', {
    //   fields: ['username'], type: 'unique', name: 'unique_username_constraint'
    // });
    // await queryInterface.addConstraint('Users', {
    //    fields: ['email'], type: 'unique', name: 'unique_email_constraint'
    // });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};