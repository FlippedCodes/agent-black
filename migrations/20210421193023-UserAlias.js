module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('UserAlias', {
    userID: {
      type: Sequelize.STRING(30),
      primaryKey: true,
      autoIncrement: true,
    },
    aliasUserID: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    addedBy: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('UserAlias'),
};
