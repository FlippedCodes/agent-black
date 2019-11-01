const Sequelize = require('sequelize');

module.exports = sequelize.define('ParticipatingServer', {
  serverID: {
    type: Sequelize.STRING(30),
    primaryKey: true,
    unique: true,
  },
});
