module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('UserPoints', {
    ID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pointsID: {
      type: Sequelize.INTEGER,
      references: {
        model: 'PointsList',
        key: 'ID',
      },
    },
    userID: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    teamMember: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    note: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('UserPoints'),
};
