const { MessageEmbed } = require('discord.js');

const Ban = require('../../database/models/Ban');

const Warn = require('../../database/models/Warn');

// checks if server is participating server
function getServerEntry(serverID) {
  return client.functions.get('GET_DB_registered').run(serverID, false);
}

// get log channel of server
function findLogChannel(logChannelID) {
  return client.channels.cache.find((channel) => channel.id === logChannelID);
}

async function sendMessage(channel, body, title, color, footer) {
  // needs to be local as settings overlap from dofferent embed-requests
  const embed = new MessageEmbed();

  if (body) embed.setDescription(body);
  if (title) embed.setTitle(title);
  if (color) embed.setColor(color);
  if (footer) embed.setFooter({ text: footer });

  return channel.send({ embeds: [embed] });
}

// send message when user is banned
async function prepareMessage(serverID, userID, userTag, userBans, userWarns, alias, orgUserTag) {
  const server = await getServerEntry(serverID);
  const logChannelID = server.logChannelID;
  const logChannel = await findLogChannel(logChannelID);
  const serverName = server.serverName;

  // update title, when alias
  const title = alias ? `Alias of '${orgUserTag}'` : `Known user joined '${serverName}'`;

  sendMessage(logChannel, `tag: \`${userTag}\`
  ID: \`${userID}\`
  bans: \`${userBans}\`
  warns: \`${userWarns}\`
  For more information use \`/lookup ${userID}\``, title, 'ORANGE');
}

module.exports.run = async (member) => {
  // check if member is a bot
  if (member.user.bot) return;
  // check if server is setup
  if (!await client.functions.get('GET_DB_registered').run(member.guild.id, false)) return;
  // record user tag
  client.functions.get('SET_DB_userTagRecord').run(member.id, member.user.tag);
  // check if user is banned on some server
  const [serverID, orgUserID, orgUserTag] = [member.guild.id, member.id, member.user.tag];
  // get all bans and warnings the joined user has
  const userBans = await Ban.count({ where: { userID: orgUserID } }).catch(ERR);
  const userWarns = await Warn.count({ where: { userID: orgUserID } }).catch(ERR);
  // calculate sum and check if sum is 0
  const overallAmmount = userBans + userWarns;
  if (overallAmmount === 0) return;
  // post message
  prepareMessage(serverID, orgUserID, orgUserTag, userBans, userWarns);

  // lookup aliases
  // check if user has aliases
  const output = await client.functions.get('GET_DB_alias').run(member.id);
  if (output) {
    output.forEach(async (aliasUserID) => {
      if (orgUserID === aliasUserID) return;
      const aliasUser = await client.users.fetch(aliasUserID, false).catch(ERR);
      const aliasUserBans = await Ban.count({ where: { userID: aliasUserID } }).catch(ERR);
      const aliasUserWarns = await Warn.count({ where: { userID: aliasUserID } }).catch(ERR);
      prepareMessage(serverID, aliasUserID, aliasUser.tag, aliasUserBans, aliasUserWarns, true, orgUserTag);
    });
  }
};

module.exports.data = {
  name: 'guildMemberAdd',
};
