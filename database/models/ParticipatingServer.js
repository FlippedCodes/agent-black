const Sequelize = require('sequelize');

module.exports = sequelize.define('ParticipatingServer', {
  serverID: {
    type: Sequelize.INTEGER(30),
    primaryKey: true,
    unique: true,
  },
});
