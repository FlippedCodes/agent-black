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
    `For more information and other bans and memos use '/lookup ${userID}'`,
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
  const footer = `For more information and other bans and memos use '/lookup ${orgUserTag}'`;
  sendMessage(channel, body, title, 'ORANGE', footer);
}

module.exports.run = async ({ guild, user }) => {
  // check if server is setup
  if (!await client.functions.get('GET_DB_registered').run(guild.id, false)) return;
  // outside of ban due to followup code
  const userID = user.id;
  const userTag = user.tag;
  const serverID = guild.id;

  // check if member is a bot
  if (user.bot) return;
  // checking if user is AB
  if (userID === client.user.id) return;
  // check if server is blacklsited before sending api request
  const bannedGuild = await getServerEntry(serverID);
  if (bannedGuild.blocked) return;
  // declaring so ban reason can be used in foreach loop
  // getting newly added ban
  const ban = await guild.bans.fetch(user);
  // fix ban reason by filtering new line breaks
  const reason = ban.reason;
  const fixedReason = reason === null ? reason : reason.replace(/'/g, '`');
  // get logChannel
  const logChannel = await client.channels.cache.get(bannedGuild.logChannelID);


  // check ban reason is valid
  if (reason === null
    || reason.length <= 2
    || config.functions.banList.blacklistedBanReasons.some((blacklistReason) => reason.toLowerCase().includes(blacklistReason.toLowerCase()))) {
    if (bannedGuild && bannedGuild.active && bannedGuild.logChannelID) {
      const mainLogChannel = client.channels.cache.get(config.logChannel);
      if (!DEBUG) {
        await sendMessage(
          mainLogChannel,
          `ServerID: \`${serverID}\`\nUserTag: \`${userTag}\`\nUserID: \`${userID}\`\nReason: \`${fixedReason}\``,
          'Invalid ban rejected!',
          'ORANGE',
          'Invalid ban rejected.',
        );
      }
      // delete ban from DB if existing
      await Ban.destroy({
        limit: 1,
        where: { userID, serverID },
      }).catch(ERR);
      // inform server
      return sendMessage(
        logChannel,
        `The user \`${userTag}\` with the ID \`${userID}\` has been banned from this server,\nbut has not been added to the Agent Black Blacklist!\n**Other servers are NOT getting warned.**\nYour ban reason was rejected: \`${fixedReason}\``,
        'A user has been banned but not reported!',
        'ORANGE',
        'Try re-banning the user with a valid reason.',
      );
    }
  }
  // assign simpler values
  const userBanned = '1';
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
    sendMessage(logChannel, `The user \`${userTag}\` with the ID \`${userID}\` has been banned from this server!\nReason: \`${fixedReason}\`\n\nIf this is a personal ban, please re-ban the user and use "Personal:" at the start your reason. Thank you.`, 'A user has been banned!', 'GREEN', 'The ban has been recorded and other servers are getting warned!');
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
