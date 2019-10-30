const Sequelize = require('sequelize');

module.exports = global.sequelize.define('Tag', {
  tagID: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.TEXT('tiny'),
    allowNull: false,
  },
});
