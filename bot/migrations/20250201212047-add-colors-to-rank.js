module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Rank', 'bgColor', {
      type: Sequelize.STRING,
      defaultValue: "#000000",
    });
    await queryInterface.addColumn('Rank', 'barColor', {
      type: Sequelize.STRING,
      defaultValue: "#FFFFFF",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Rank', 'bgColor');
    await queryInterface.removeColumn('Rank', 'barColor');
  },
};
