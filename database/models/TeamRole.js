const Sequelize = require('sequelize');

module.exports = sequelize.define('TeamRole', {
  serverID: {
    type: Sequelize.STRING(30),
    primaryKey: true,
    references: {
      model: 'ParticipatingServers',
      key: 'serverID',
    },
  },
  roleID: {
    type: Sequelize.STRING(30),
    unique: true,
  },
},
{
  uniqueKeys: {
    uniqueTeamRole: {
      fields: ['serverID', 'roleID'],
    },
  },
});
