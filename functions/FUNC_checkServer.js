const ParticipatingServer = require('../database/models/ParticipatingServer');

module.exports.run = async (serverID, onlyCheckEntry) => {
  if (onlyCheckEntry) {
    return ParticipatingServer.findOne({ where: { serverID } })
      .catch((err) => console.error(err));
  }
  return ParticipatingServer.findOne({ where: { serverID, active: true, blocked: false } })
    .catch((err) => console.error(err));
};

module.exports.help = {
  name: 'FUNC_checkServer',
};
