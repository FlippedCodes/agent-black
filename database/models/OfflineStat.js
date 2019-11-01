const Sequelize = require('sequelize');

module.exports = sequelize.define('OfflineStat', {
  time: {
    type: Sequelize.STRING(30),
    primaryKey: true,
  },
});
