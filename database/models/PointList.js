const Sequelize = require('sequelize');

module.exports = sequelize.define('PointList', {
  ID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.TEXT('tiny'),
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  points: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});
