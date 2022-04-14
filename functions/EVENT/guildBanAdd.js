const Ban = require('../../database/models/Ban');

// const ParticipatingServer = require('../database/models/ParticipatingServer');

// checks if server is partisipating server
function getServerEntry(serverID) {
  return client.functions.get('GET_DB_registered').run(serverID, true);
}

// creates a embed messagetemplate for succeded actions
async function messageBanSuccess(channelID, body) {
  const channel = await client.channels.cache.get(channelID);
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, channel, body, 'A user has been banned!', 4296754, 'The ban has been recorded and other servers are getting warned!');
}

// creates a embed messagetemplate for failed actions
async function messageBannedUserInGuild(channelID, userTag, userID, banReason, serverName) {
  const channel = await client.channels.cache.get(channelID);
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, channel,
      `Tag: \`${userTag}\`
      ID: \`${userID}\`
      Reason: \`\`\`${banReason || 'none'}\`\`\``,
      `A user on your server has been banned on '${serverName}'!`,
      16739072,
      `For more information and other bans and warns use '/lookup ${userID}'`);
}

// warns other servers for aliases
async function messageBannedAliasUserInGuild(channelID, userTag, userID, warnReason, serverName, orgUserTag) {
  const channel = await client.channels.cache.get(channelID);
  const body = `**The user \`${userTag}\` is an alias of a user that has been banned!**

  Tag: \`${orgUserTag}\`
  ID: \`${userID}\`
  Reason: \`\`\`${warnReason || 'none'}\`\`\``;
  const header = `A alias of a user on your server has been banned on '${serverName}'!`;
  const footer = `For more information and other bans and warns use '/lookup ${orgUserTag}'`;
  client.functions.get('FUNC_richEmbedMessage').run(client.user, channel, body, header, 'ORANGE', footer);
}

module.exports.run = async ({ guild, user }) => {
  // check if server is setup
  if (!await client.functions.get('GET_DB_registered').run(guild.id, false)) return;
  // outside of ban due to followup code
  const userID = user.id;
  const userTag = user.tag;
  const serverID = guild.id;
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
        Ban.update({ reason: fixedReason, userTag, userBanned },
          { where: { userTag, userID, serverID } })
          .catch(ERR);
      }
  // logic, to only output if not banned, is active and has a log channel
      if (bannedGuild && bannedGuild.active && bannedGuild.logChannelID) {
        messageBanSuccess(bannedGuild.logChannelID, `The user \`${userTag}\` with the ID \`${userID}\` has been banned from this server!\nReason: \`${fixedReason}\``);
      }
  // post for other servers
  let aliases = await user.client.functions.get('FUNC_checkAlias').run(userID);
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
