const Sequelize = require('sequelize');

module.exports = sequelize.define('UserPunnishmentTicker', {
  ID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  punnishmentID: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'PunishmentLevels',
      key: 'ID',
    },
  },
  userID: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
  ammountLeft: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});
