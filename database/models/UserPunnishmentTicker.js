const Sequelize = require('sequelize');

module.exports = sequelize.define('UserPunishmentTicker', {
  ID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  punishmentID: {
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
  amountLeft: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});
