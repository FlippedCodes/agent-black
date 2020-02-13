const { RichEmbed } = require('discord.js');

const Ban = require('../database/models/Ban');

// error Handler
const errHander = (err) => {
  console.error('ERROR:', err);
};

// const server = (serverID) => {
//   return client.functions.get('FUNC_checkServer').run(serverID);
// }

// checks if server is partisipating server

function getServerEntry(client, serverID) {
  return client.functions.get('FUNC_checkServer').run(serverID);
}

// searches for the log channel in the server
function findLogChannel(client, logChannelID) {
  return client.channels.find((channel) => channel.id === logChannelID);
}

// send message
async function sendMessage(client, serverID, userID, ammountOfBans) {
  const server = await getServerEntry(client, serverID);
  let logChannelID = server.logChannelID;
  let logChannel = await findLogChannel(client, logChannelID);
  let serverName = server.serverName;
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, logChannel,
      'This is a text placeholder',
      `Banned user joined ${serverName}!`,
      16739072, true);
}

// TODO: Update userTag in DB if not a deleted username
// TODO: Add reactions for banning
// TODO: Add banned user logs

module.exports.run = async (client, member) => {
  let userID = member.id;
  let serverID = member.guild.id;

  const userBans = await Ban.findAll({
    where: {
      userID,
    },
  }).catch(errHander);

  if (userBans.length !== 0) sendMessage(client, serverID, userID, userBans.length);
};

module.exports.help = {
  name: 'EVENT_guildMemberAdd',
};
