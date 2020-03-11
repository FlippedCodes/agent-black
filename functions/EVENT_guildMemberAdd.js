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

// get log channel of server
function findLogChannel(client, logChannelID) {
  return client.channels.find((channel) => channel.id === logChannelID);
}

// send message when user is banned
async function sendMessage(client, serverID, userID, ammountOfBans) {
  const server = await getServerEntry(client, serverID);
  const logChannelID = server.logChannelID;
  const logChannel = await findLogChannel(client, logChannelID);
  const serverName = server.serverName;
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, logChannel,
      `ID: \`${userID}\`
      userBans: \`${ammountOfBans}\`
      For more information use `,
      `Banned user joined ${serverName}!`,
      16739072, false);
}

// check if user is banned on some server
async function checkBannedUser(client, serverID, userID, ammountOfBans) {
  const userBans = await Ban.findAll({ where: { userID } }).catch(errHander);
  if (userBans.length !== 0) sendMessage(client, serverID, userID, userBans.length);
}

// TODO: Update userTag in DB if not a deleted username
// TODO: Add reactions for banning
// TODO: Add banned user logs

module.exports.run = async (client, member) => {
  checkBannedUser(client, member.guild.id, member.id);
};

module.exports.help = {
  name: 'EVENT_guildMemberAdd',
};
