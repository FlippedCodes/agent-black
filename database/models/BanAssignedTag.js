const Sequelize = require('sequelize');

module.exports = DB.define('BanAssignedTag', {
  banID: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    primaryKey: true,
  },
  tagID: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
  },
});
