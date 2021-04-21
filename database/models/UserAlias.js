const Sequelize = require('sequelize');

module.exports = sequelize.define('UserAlias', {
  aliasID: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  mainUser: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
  aliasUser: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
  addedBy: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
});
