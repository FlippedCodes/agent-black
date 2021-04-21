const Sequelize = require('sequelize');

module.exports = sequelize.define('UserAlias', {
  aliasID: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  userID: {
    type: Sequelize.STRING(30),
    allowNull: false,
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
