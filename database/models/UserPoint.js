const Sequelize = require('sequelize');

module.exports = sequelize.define('UserPoint', {
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
});
