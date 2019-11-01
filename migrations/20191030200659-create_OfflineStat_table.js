module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('OfflineStats', {
    time: {
      type: Sequelize.STRING(30),
      primaryKey: true,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('OfflineStats'),
};
