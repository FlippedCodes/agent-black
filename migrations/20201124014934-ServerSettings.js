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
      type: Sequelize.STRING(30),
      allowNull: false,
      defaultValue: 1210000000,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('ServerSettings'),
};
