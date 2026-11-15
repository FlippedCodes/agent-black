const Ban = require('../../database/models/Ban');

// finds a server in the ParticipatingServers table
async function findServer(ParticipatingServer, serverID) {
  const found = await ParticipatingServer.findOne({ where: { serverID } })
    .catch(ERR);
  return found;
}

module.exports.run = async (interaction, ParticipatingServer, serverID) => {
  const serverFound = await findServer(ParticipatingServer, serverID);
  const message = interaction.options.getString('message', true);
  if (serverFound) {
    // send message to server
    const channel = await client.channels.fetch(serverFound.logChannelID);
    await channel.send(`Hello <@&${serverFound.teamRoleID}>!
A maintainer of our bot is trying to reach out to your server.
\`\`\`
${message}
\`\`\`
Depending on their request, please join our support server: https://discord.gg/TqBwHtzzhD`);
    messageSuccess(interaction, `Message sent: ${message}`);
  } else {
    messageFail(interaction, `The server with the ID \`${serverID}\` couldn't be found in the list.`);
  }
};

module.exports.data = { subcommand: true };
