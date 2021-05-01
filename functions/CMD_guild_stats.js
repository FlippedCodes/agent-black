const ParticipatingServer = require('../database/models/ParticipatingServer');

const Ban = require('../database/models/Ban');

// finds a server in the ParticipatingServers table
async function findServer(serverID) {
  const found = await ParticipatingServer.findOne({ where: { serverID } })
    .catch((err) => console.error(err));
  return found;
}

async function getBanCount(serverID) {
  const result = await Ban.findAndCountAll({ where: { serverID } });
  return result.count;
}

module.exports.run = async (client, message, args, config, prefix) => {
  // get entry
  const serverFound = await findServer(message.guild.id);
  // if entry is found
  if (serverFound) {
    let content = `
    Servername: \`${serverFound.serverName}\`
    Server ID: \`${serverFound.serverID}\`
    Log Channel: <#${serverFound.logChannelID}> (\`${serverFound.logChannelID}\`)
    Team Role ID: \`${serverFound.teamRoleID}\`
    Submitted Bans: \`${await getBanCount(serverFound.serverID)}\`
    Is server apart of Association: \`${serverFound.active}\``;
    if (serverFound.active) content += `\nParticipating Server since \`${serverFound.updatedAt}\``;
    messageSuccess(message, content);
  } else {
    messageFail(message,
      `The server with the ID \`${serverID}\` couldn't be found.`);
  }
};

module.exports.help = {
  name: 'CMD_guild_stats',
  parent: 'guild',
};
