const Sequelize = require('sequelize');

module.exports = sequelize.define('ParticipatingServer', {
  serverID: {
    type: Sequelize.STRING(30),
    primaryKey: true,
    unique: true,
  },
  logChannelID: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
  teamRoleID: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
  serverName: {
    type: Sequelize.TEXT('tiny'),
    allowNull: false,
  },
  active: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});
