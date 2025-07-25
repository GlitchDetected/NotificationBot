'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Welcome', 'welcomeMessageIds', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {}
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Welcome', 'welcomeMessageIds');
  }
};