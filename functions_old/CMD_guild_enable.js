const ParticipatingServer = require('../database/models/ParticipatingServer');

// removes a server from the ParticipatingServers table
async function enableServer(serverID) {
  const success = await ParticipatingServer.update(
    { active: true },
    { where: { serverID, active: false, blocked: false } },
  )
    .catch(errHandler);
  return success[0];
}

// check if server has feature enabled.
async function checkData(serverID) {
  const found = await ParticipatingServer.findOne({
    where: { serverID },
    attributes: ['logChannelID', 'teamRoleID'],
  }).catch(errHandler);
  return found;
}

module.exports.run = async (client, message, args, config, prefix) => {
  const serverID = message.guild.id;
  if (!await checkData(serverID)) return messageFail(message, 'You can\'t use this command without setting up your server first!');
  const serverRemoved = await enableServer(serverID);
  if (serverRemoved >= 1) {
    messageSuccess(message,
      `The server with the ID \`${serverID}\` got re-enabled in the participating Servers list.`);
  } else {
    messageFail(message,
      `The server with the ID \`${serverID}\` couldn't be found of the list or is already active.`);
  }
};

module.exports.help = {
  name: 'CMD_guild_enable',
  parent: 'guild',
};
