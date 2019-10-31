const Sequelize = require('sequelize');

module.exports = sequelize.define('OfflineStat', {
  time: {
    type: Sequelize.INTEGER(30),
    allowNull: false,
    primaryKey: true,
  },
});
