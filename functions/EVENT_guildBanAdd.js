const Ban = require('../database/models/Ban');

// const ParticipatingServer = require('../database/models/ParticipatingServer');

const config = require('../config/main.json');

const errHandler = (err) => {
  console.error('ERROR:', err);
};

// checks if server is partisipating server
function getServerEntry(client, serverID) {
  return client.functions.get('FUNC_checkServer').run(serverID, true);
}

// creates a embed messagetemplate for succeded actions
async function messageBanSuccess(client, channelID, body) {
  const channel = await client.channels.cache.get(channelID);
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, channel, body, 'A user has been banned!', 4296754, 'The ban has been recorded and other servers are getting warned!');
}

// creates a embed messagetemplate for failed actions
async function messageBannedUserInGuild(client, channelID, userTag, userID, banReason, serverName) {
  const channel = await client.channels.cache.get(channelID);
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, channel,
      `Tag: \`${userTag}\`
      ID: \`${userID}\`
      Reason: \`${banReason || 'none'}\``,
      `A user on your server has been banned on '${serverName}'!`,
      16739072,
      `For more information and other bans and warns use '${config.prefix}lookup ${userID}'`);
}

module.exports.run = async (guild, user) => {
  // outside of ban due to followup code
  const userID = user.id;
  const userTag = user.tag;
  // declaring so ban reason can be used in foreach loop
  let banReason;
  // getting newly added ban
  await guild.fetchBan(user)
    .then(async (ban) => {
      // assign simpler values
      const serverID = guild.id;
      const userBanned = '1';
      const reason = ban.reason;
      // fix ban reason by filtering new line breaks
      let fixedReason = reason;
      if (reason !== null) fixedReason = reason.replace(new RegExp('\'', 'g'), '`');
      // create of find DB entry
      const [banEntry] = await Ban.findOrCreate({
        where: { userID, serverID },
        defaults: { userTag, reason: fixedReason, userBanned },
      }).catch(errHandler);
      // check if entry is already on DB
      if (await !banEntry.isNewRecord) {
        // update DB entry
        Ban.update({ reason: fixedReason, userTag, userBanned },
          { where: { userTag, userID, serverID } })
          .catch(errHandler);
      }
      banReason = fixedReason;
      const bannedGuild = await getServerEntry(user.client, serverID);
      if (bannedGuild && bannedGuild.active && bannedGuild.logChannelID) {
        messageBanSuccess(user.client, bannedGuild.logChannelID, `The user \`${userTag}\` with the ID \`${userID}\` has been banned from this server!\nReason: \`${fixedReason}\``);
      }
    });
  user.client.guilds.cache.forEach(async (toTestGuild) => {
    if (guild.id === toTestGuild.id) return;
    const serverMember = toTestGuild.members.cache.get(user.id);
    if (serverMember) {
      const serverID = toTestGuild.id;
      const infectedGuild = await getServerEntry(user.client, serverID);
      if (infectedGuild.logChannelID && infectedGuild.active) {
        messageBannedUserInGuild(user.client, infectedGuild.logChannelID, userTag, userID, banReason, guild.name);
      }
    }
  });
};

module.exports.help = {
  name: 'EVENT_guildBanAdd',
};
