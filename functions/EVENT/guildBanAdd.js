const Ban = require('../../database/models/Ban');

// const ParticipatingServer = require('../database/models/ParticipatingServer');

// checks if server is partisipating server
function getServerEntry(client, serverID) {
  return client.functions.get('CHECK_registered').run(serverID, true);
}

// creates a embed messagetemplate for succeded actions
async function messageBanSuccess(client, channelID, body) {
  const channel = await client.channels.cache.get(channelID);
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, channel, body, 'A user has been banned!', 4296754, 'The ban has been recorded and other servers are getting warned!');
}

// creates a embed messagetemplate for failed actions
async function messageBannedUserInGuild(client, prefix, channelID, userTag, userID, banReason, serverName) {
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
async function messageBannedAliasUserInGuild(client, prefix, channelID, userTag, userID, warnReason, serverName, orgUserTag) {
  const channel = await client.channels.cache.get(channelID);
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, channel,
      `**The user \`${userTag}\` is an alias of a user that has been banned!**

      Tag: \`${orgUserTag}\`
      ID: \`${userID}\`
      Reason: \`\`\`${warnReason || 'none'}\`\`\``,
      `A alias of a user on your server has been banned on '${serverName}'!`,
      16755456,
      `For more information and other bans and warns use '/lookup ${orgUserTag}'`);
}

module.exports.run = async (guild, user) => {
  // check if server is setup
  if (!await client.functions.get('CHECK_registered').run(member.guild.id, false)) return;
  // outside of ban due to followup code
  const userID = user.id;
  const userTag = user.tag;
  const serverID = guild.id;
  // check if server is blacklsited before sending api request
  const bannedGuild = await getServerEntry(user.client, serverID);
  if (bannedGuild.blocked) return;
  // declaring so ban reason can be used in foreach loop
  let banReason;
  // getting newly added ban
  await guild.fetchBan(user)
    .then(async (ban) => {
      // assign simpler values
      const userBanned = '1';
      const reason = ban.reason;
      // fix ban reason by filtering new line breaks
      let fixedReason = reason;
      if (reason !== null) fixedReason = reason.replace(new RegExp('\'', 'g'), '`');
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
      banReason = fixedReason;
      if (bannedGuild && bannedGuild.active && bannedGuild.logChannelID) {
        messageBanSuccess(user.client, bannedGuild.logChannelID, `The user \`${userTag}\` with the ID \`${userID}\` has been banned from this server!\nReason: \`${fixedReason}\``);
      }
    });
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
      const infectedGuild = await getServerEntry(user.client, serverID);
      if (infectedGuild && infectedGuild.blocked) return;
      if (infectedGuild && infectedGuild.active && infectedGuild.logChannelID) {
        if (userID === toCheckUserID) messageBannedUserInGuild(user.client, 'a!', infectedGuild.logChannelID, userTag, userID, banReason, guild.name);
        else messageBannedAliasUserInGuild(user.client, 'a!', infectedGuild.logChannelID, serverMember.user.tag, userID, banReason, guild.name, userTag);
      }
    });
  });
};

module.exports.data = {
  name: 'guildBanAdd',
};
