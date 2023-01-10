const Ban = require('../../database/models/Ban');

// finds a server in the ParticipatingServers table
async function findServer(ParticipatingServer, serverID) {
  const found = await ParticipatingServer.findOne({ where: { serverID } })
    .catch(ERR);
  return found;
}

async function getBanCount(serverID) {
  const result = await Ban.findAndCountAll({ where: { serverID } });
  return result.count;
}

module.exports.run = async (interaction, ParticipatingServer, serverID) => {
  const serverFound = await findServer(ParticipatingServer, serverID);
  if (serverFound) {
    let content = `
    Servername: \`${serverFound.serverName}\`
    Server ID: \`${serverFound.serverID}\`
    Log Channel: <#${serverFound.logChannelID}> (\`${serverFound.logChannelID}\`)
    Team Role ID: \`${serverFound.teamRoleID}\`
    Submitted Bans: \`${await getBanCount(serverID)}\`
    Is server apart of Association: \`${serverFound.active}\``;
    if (serverFound.active) content += `\nParticipating Server since \`${serverFound.updatedAt}\``;
    messageSuccess(interaction, content);
  } else {
    messageFail(interaction,
      `The server with the ID \`${serverID}\` couldn't be found in the list.`);
  }
};

module.exports.data = { subcommand: true };
