const Sequelize = require('sequelize');

module.exports = global.sequelize.define('BanAssignedTag', {
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
