module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('OfflineStats', {
    time: {
      type: Sequelize.INTEGER(30),
      primaryKey: true,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('OfflineStats'),
};
