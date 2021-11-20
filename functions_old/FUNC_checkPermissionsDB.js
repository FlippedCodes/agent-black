const Maintainer = require('../database/models/Maintainer');

const ParticipatingServer = require('../database/models/ParticipatingServer');

module.exports.run = async (userID, type, serverID, member) => {
  switch (type) {
    case 'maintainer': return Maintainer.findOne({ where: { userID } }).catch(errHandler);
    case 'staff':
      const serverSettings = await ParticipatingServer.findOne({ where: { serverID } }).catch(errHandler);
      const output = await member.roles.cache.find((role) => role.id === serverSettings.teamRoleID);
      return output;
    default:
      return Maintainer.findOne({ where: { userID } }).catch(errHandler);
  }
};

module.exports.help = {
  name: 'FUNC_checkPermissionsDB',
};
