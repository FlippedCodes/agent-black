const { RichEmbed } = require('discord.js');

const Ban = require('../database/models/Ban');

const config = require('../config/main.json');

// error Handler
const errHander = (err) => {
  console.error('ERROR:', err);
};

// checks if server is partisipating server
function getServerEntry(client, serverID) {
  return client.functions.get('FUNC_checkServer').run(serverID);
}

// get log channel of server
function findLogChannel(client, logChannelID) {
  return client.channels.find((channel) => channel.id === logChannelID);
}

// send message when user is banned
async function sendMessage(client, serverID, userID, userTag, ammountOfBans) {
  const server = await getServerEntry(client, serverID);
  const logChannelID = server.logChannelID;
  const logChannel = await findLogChannel(client, logChannelID);
  const serverName = server.serverName;
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, logChannel,
      `tag: \`${userTag}\`
      ID: \`${userID}\`
      bans: \`${ammountOfBans}\`
      For more information use \`${config.prefix}lookup ${userID}\``,
      `Banned user joined '${serverName}'`,
      16739072, false);
  // TODO: Add command to see more information for user
}

// check if user is banned on some server
async function checkBannedUser(client, member) {
  const [serverID, userID, userTag] = [member.guild.id, member.id, member.user.tag];
  const userBans = await Ban.findAll({ where: { userID } }).catch(errHander);
  if (userBans.length !== 0) sendMessage(client, serverID, userID, userTag, userBans.length);
}

// TODO: Update userTag in DB if not a deleted username
// TODO: Add reactions for banning
// TODO: Add banned user logs

module.exports.run = async (client, member) => checkBannedUser(client, member);

module.exports.help = {
  name: 'EVENT_guildMemberAdd',
};
