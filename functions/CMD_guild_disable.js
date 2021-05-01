const ParticipatingServer = require('../database/models/ParticipatingServer');

// removes a server from the ParticipatingServers table
async function removeServer(serverID) {
  const success = await ParticipatingServer.update(
    { active: false },
    { where: { serverID, active: true } },
  )
    .catch(errHandler);
  return success[0];
}

module.exports.run = async (client, message, args, config, prefix) => {
  const serverID = message.guild.id;
  const serverRemoved = await removeServer(serverID);
  if (serverRemoved >= 1) {
    messageSuccess(message,
      `The server with the ID \`${serverID}\` got disabled from the participating Servers list.`);
  } else {
    messageFail(message,
      `The server with the ID \`${serverID}\` couldn't be found of the list.`);
  }
};

module.exports.help = {
  name: 'CMD_guild_disable',
  parent: 'guild',
};
