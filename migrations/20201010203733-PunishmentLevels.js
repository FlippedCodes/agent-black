module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('PunishmentLevels', {
    ID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    name: {
      type: Sequelize.TEXT('tiny'),
      allowNull: false,
    },
    command: {
      type: Sequelize.TEXT('tiny'),
      allowNull: false,
    },
    ammount: Sequelize.INTEGER,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('PunishmentLevels'),
};
