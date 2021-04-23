const Sequelize = require('sequelize');

module.exports = sequelize.define('UserAlias', {
  aliasID: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  groupingID: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
  userID: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
  addedBy: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
});
