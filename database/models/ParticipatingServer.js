const Sequelize = require('sequelize');

module.exports = sequelize.define('ParticipatingServer', {
  serverID: {
    type: Sequelize.STRING(30),
    primaryKey: true,
    unique: true,
  },
  logChannelID: Sequelize.STRING(30),
  serverName: Sequelize.TEXT('tiny'),
},
{
  uniqueKeys: {
    banTagUnique: {
      fields: ['serverID', 'logChannelID'],
    },
  },
});
