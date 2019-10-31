const Sequelize = require('sequelize');

module.exports = sequelize.define('Ban', {
  banID: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  userID: {
    type: Sequelize.STRING(30),
    allowNull: false,
    primaryKey: true,
  },
  serverID: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
  userTag: {
    type: Sequelize.TEXT('tiny'),
    allowNull: false,
  },
  reason: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});
