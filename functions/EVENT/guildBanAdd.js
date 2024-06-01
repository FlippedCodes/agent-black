// TODO: better message implementation

const { MessageEmbed } = require('discord.js');

const Ban = require('../../database/models/Ban');

// const ParticipatingServer = require('../database/models/ParticipatingServer');

async function sendMessage(channel, body, title, color, footer) {
  // needs to be local as settings overlap from dofferent embed-requests
  const embed = new MessageEmbed();

  if (body) embed.setDescription(body);
  if (title) embed.setTitle(title);
  if (color) embed.setColor(color);
  if (footer) embed.setFooter({ text: footer });

  return channel.send({ embeds: [embed] });
}

// checks if server is partisipating server
function getServerEntry(serverID) {
  return client.functions.get('GET_DB_registered').run(serverID, true);
}

// creates a embed messagetemplate for succeded actions
async function messageBanSuccess(channelID, body) {
  const channel = await client.channels.cache.get(channelID);
  sendMessage(channel, body, 'A user has been banned!', 'GREEN', 'The ban has been recorded and other servers are getting warned!');
}

// creates a embed messagetemplate for failed actions
async function messageBannedUserInGuild(channelID, userTag, userID, banReason, serverName) {
  const channel = await client.channels.cache.get(channelID);
  sendMessage(
    channel,
    `Tag: \`${userTag}\`
    ID: \`${userID}\`
    Reason: \`\`\`${banReason || 'none'}\`\`\``,
    `A user on your server has been banned on '${serverName}'!`,
    'ORANGE',
    `For more information and other bans and warns use '/lookup ${userID}'`,
  );
}

// warns other servers for aliases
async function messageBannedAliasUserInGuild(channelID, userTag, userID, warnReason, serverName, orgUserTag) {
  const channel = await client.channels.cache.get(channelID);
  const body = `**The user \`${userTag}\` is an alias of a user that has been banned!**

  Tag: \`${orgUserTag}\`
  ID: \`${userID}\`
  Reason: \`\`\`${warnReason || 'none'}\`\`\``;
  const title = `A alias of a user on your server has been banned on '${serverName}'!`;
  const footer = `For more information and other bans and warns use '/lookup ${orgUserTag}'`;
  sendMessage(channel, body, title, 'ORANGE', footer);
}

module.exports.run = async ({ guild, user }) => {
  // check if server is setup
  if (!await client.functions.get('GET_DB_registered').run(guild.id, false)) return;
  // outside of ban due to followup code
  const userID = user.id;
  const userTag = user.tag;
  const serverID = guild.id;

  // checking if user is AB
  if (userID === client.user.id) return;
  // check if server is blacklsited before sending api request
  const bannedGuild = await getServerEntry(serverID);
  if (bannedGuild.blocked) return;
  // declaring so ban reason can be used in foreach loop
  // getting newly added ban
  const ban = await guild.bans.fetch(user);
  // assign simpler values
  const userBanned = '1';
  const reason = ban.reason;
  // fix ban reason by filtering new line breaks
  const fixedReason = reason === null ? reason : reason.replace(new RegExp('\'', 'g'), '`');
  // create of find DB entry
  const [banEntry] = await Ban.findOrCreate({
    where: { userID, serverID },
    defaults: { userTag, reason: fixedReason, userBanned },
  }).catch(ERR);
  // check if entry is already on DB
  if (await !banEntry.isNewRecord) {
    // update DB entry
    Ban.update(
      { reason: fixedReason, userTag, userBanned },
      { where: { userTag, userID, serverID } },
    ).catch(ERR);
  }
  // logic, to only output if not banned, is active and has a log channel
  if (bannedGuild && bannedGuild.active && bannedGuild.logChannelID) {
    messageBanSuccess(bannedGuild.logChannelID, `The user \`${userTag}\` with the ID \`${userID}\` has been banned from this server!\nReason: \`${fixedReason}\``);
  }
  // post for other servers
  let aliases = await user.client.functions.get('GET_DB_alias').run(userID);
  if (!aliases) aliases = [userID];
  aliases.forEach((toCheckUserID) => {
    user.client.guilds.cache.forEach(async (toTestGuild) => {
      if (guild.id === toTestGuild.id) return;
      const serverMember = toTestGuild.members.cache.get(toCheckUserID);
      // TODO: warn own server that there are aliases
      if (!serverMember) return;
      const serverID = toTestGuild.id;
      const infectedGuild = await getServerEntry(serverID);
      if (infectedGuild && infectedGuild.blocked) return;
      if (infectedGuild && infectedGuild.active && infectedGuild.logChannelID) {
        if (userID === toCheckUserID) messageBannedUserInGuild(infectedGuild.logChannelID, userTag, userID, fixedReason, guild.name);
        else messageBannedAliasUserInGuild(infectedGuild.logChannelID, serverMember.user.tag, userID, fixedReason, guild.name, userTag);
      }
    });
  });
};

module.exports.data = {
  name: 'guildBanAdd',
};
