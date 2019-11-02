module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Maintainers', {
    userID: {
      type: Sequelize.STRING(30),
      primaryKey: true,
      unique: true,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('Maintainers'),
};
