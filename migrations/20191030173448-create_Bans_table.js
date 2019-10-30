module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Bans', {
    banID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userID: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    serverID: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    userTag: Sequelize.TEXT('tiny'),
    reason: Sequelize.TEXT,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('Bans'),
};
