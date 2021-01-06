const Sequelize = require('sequelize');

module.exports = sequelize.define('Ban', {
  ID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userID: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
  userTag: {
    type: Sequelize.TEXT('tiny'),
    allowNull: false,
  },
},
{
  uniqueKeys: {
    uniqueUserTagID: {
      fields: ['userTag', 'userID'],
    },
  },
});
