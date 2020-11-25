module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ServerSettings', {
    serverID: {
      type: Sequelize.STRING(30),
      primaryKey: true,
    },
    setting: {
      type: Sequelize.TEXT('tiny'),
      references: {
        model: 'PointsList',
        key: 'ID',
      },
    },
    value: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('ServerSettings'),
};
