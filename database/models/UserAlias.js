const Sequelize = require('sequelize');

module.exports = sequelize.define('UserAlias', {
  userID: {
    type: Sequelize.STRING(30),
    primaryKey: true,
    autoIncrement: true,
  },
  aliasUserID: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
  addedBy: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
});
