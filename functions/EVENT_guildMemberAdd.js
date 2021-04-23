const { MessageEmbed } = require('discord.js');

const Ban = require('../database/models/Ban');

const Warn = require('../database/models/Warn');

const config = require('../config/main.json');

// error Handler
const errHandler = (err) => {
  console.error('ERROR:', err);
};

// checks if server is participating server
function getServerEntry(client, serverID) {
  return client.functions.get('FUNC_checkServer').run(serverID, false);
}

// get log channel of server
function findLogChannel(client, logChannelID) {
  return client.channels.cache.find((channel) => channel.id === logChannelID);
}

// send message when user is banned
async function sendMessage(client, serverID, userID, userTag, userBans, userWarns) {
  const server = await getServerEntry(client, serverID);
  const logChannelID = server.logChannelID;
  const logChannel = await findLogChannel(client, logChannelID);
  const serverName = server.serverName;
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, logChannel,
      `tag: \`${userTag}\`
      ID: \`${userID}\`
      bans: \`${userBans}\`
      warns: \`${userWarns}\`
      For more information use \`${config.prefix}lookup ${userID}\``,
      `Known user joined '${serverName}'`,
      16739072, false);
}

module.exports.run = async (client, member) => {
  // record user tag
  client.functions.get('FUNC_userTagRecord').run(member.id, member.user.tag);
  // check if user is banned on some server
  const [serverID, userID, userTag] = [member.guild.id, member.id, member.user.tag];
  // get all bans and warnings the joined user has
  const userBans = await Ban.findAll({ where: { userID } }).catch(errHandler);
  const userWarns = await Warn.findAll({ where: { userID } }).catch(errHandler);
  // calculate sum and check if sum is still 0
  const overallAmmount = userBans.length + userWarns.length;
  if (overallAmmount !== 0) sendMessage(client, serverID, userID, userTag, userBans.length, userWarns.length);
};

module.exports.help = {
  name: 'EVENT_guildMemberAdd',
};
