module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Warns', {
    warnID: {
      type: Sequelize.INTEGER(11),
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
    reason: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    userBanned: Sequelize.BOOLEAN,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('Warns'),
};
