const Sequelize = require('sequelize');

module.exports = sequelize.define('OfflineStat', {
  ID: {
    type: Sequelize.STRING(30),
    primaryKey: true,
  },
  points: {
    type: Sequelize.TINYINT,
    allowNull: false,
  },
});
