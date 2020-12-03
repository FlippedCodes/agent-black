module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ServerSettings', {
    serverID: {
      type: Sequelize.STRING(30),
      primaryKey: true,
    },
    pointsSystemEnabled: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    pointsSystemForceReason: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    pointLifetime: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      defaultValue: true,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('ServerSettings'),
};
