const Ban = require('../../database/models/Ban');

// finds a server in the ParticipatingServers table
async function findServer(ParticipatingServer, serverID) {
  const found = await ParticipatingServer.findOne({ where: { serverID } })
    .catch(ERR);
  return found;
}

module.exports.run = async (interaction, ParticipatingServer, serverID) => {
  const serverFound = await findServer(ParticipatingServer, serverID);
  if (serverFound) {
    // get 5 random bans
    const bans = await Ban.findAll({ where: { serverID: serverFound.serverID, userBanned: 1 }, order: sequelize.random(), limit: 5 });
    // post bans
    messageSuccess(interaction, `Bans on ${serverID}
\`\`\`
userID - reason
${bans.map((ban) => `${ban.userID} - ${ban.reason}`).join('\n')}
\`\`\`
`);
  } else {
    messageFail(interaction, `The server with the ID \`${serverID}\` couldn't be found in the list.`);
  }
};

module.exports.data = { subcommand: true };
