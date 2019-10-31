const Sequelize = require('sequelize');

module.exports = sequelize.define('Tag', {
  tagID: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING(15),
    allowNull: false,
    unique: true,
  },
});
