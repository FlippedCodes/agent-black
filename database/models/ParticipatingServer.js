const Sequelize = require('sequelize');

module.exports = sequelize.define('ParticipatingServer', {
  serverID: {
    type: Sequelize.STRING(30),
    primaryKey: true,
    unique: true,
  },
  logChannelID: Sequelize.STRING(30),
  teamRoleID: Sequelize.STRING(30),
  serverName: {
    type: Sequelize.TEXT('tiny'),
    allowNull: false,
  },
  active: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  blocked: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});
