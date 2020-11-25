const Sequelize = require('sequelize');

module.exports = sequelize.define('OfflineStat', {
  ID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  name: {
    type: Sequelize.TEXT('tiny'),
    allowNull: false,
  },
  command: {
    type: Sequelize.TEXT('tiny'),
    allowNull: false,
  },
  ammount: Sequelize.INTEGER,
});
