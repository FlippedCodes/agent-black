const ParticipatingServer = require('../../../database/models/ParticipatingServer');

module.exports.run = async (serverID, onlyCheckEntry) => {
  if (onlyCheckEntry) return ParticipatingServer.findOne({ where: { serverID } }).catch(ERR);
  return ParticipatingServer.findOne({ where: { serverID, active: true, blocked: false } }).catch(ERR);
};

module.exports.data = {
  name: 'registered',
};
