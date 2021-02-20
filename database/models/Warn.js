const Sequelize = require('sequelize');

module.exports = sequelize.define('Warn', {
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
});
