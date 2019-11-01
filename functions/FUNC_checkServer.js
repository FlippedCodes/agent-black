const ParticipatingServer = require('../database/models/ParticipatingServer');

module.exports.run = async (serverID) => ParticipatingServer.findOne({ where: { serverID } })
  .catch((err) => console.error(err));

module.exports.help = {
  name: 'FUNC_checkServer',
};
