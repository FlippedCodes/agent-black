const Maintainer = require('../../database/models/Maintainer');

const ParticipatingServer = require('../../database/models/ParticipatingServer');

module.exports.run = async (userID, type, serverID, member) => {
  switch (type || 'maintainer') {
    case 'maintainer': return Maintainer.findOne({ where: { userID } }).catch(ERR);
    case 'staff':
      const serverSettings = await ParticipatingServer.findOne({ where: { serverID } }).catch(ERR);
      const output = await member.roles.cache.find((role) => role.id === serverSettings.teamRoleID);
      return output;
    default:
      return 'null';
  }
};

module.exports.data = {
  name: 'DBperms',
};
