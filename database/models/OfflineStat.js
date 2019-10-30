const Sequelize = require('sequelize');

module.exports = global.sequelize.define('OfflineStat', {
  time: {
    type: Sequelize.INTEGER(30),
    allowNull: false,
    primaryKey: true,
  },
});
