const Sequelize = require('sequelize');

module.exports = sequelize.define('Ban', {
  banID: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  userID: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
  serverID: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
  userTag: Sequelize.TEXT('tiny'),
  reason: Sequelize.TEXT,
  userBanned: Sequelize.BOOLEAN,
},
{
  uniqueKeys: {
    banUnique: {
      fields: ['userID', 'serverID'],
    },
  },
});
