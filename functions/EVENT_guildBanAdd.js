const Ban = require('../database/models/Ban');

const ParticipatingServer = require('../database/models/ParticipatingServer');

const config = require('../config/main.json');

const errHander = (err) => {
  console.error('ERROR:', err);
};

// checks if server is partisipating server
function getServerEntry(client, serverID) {
  return client.functions.get('FUNC_checkServer').run(serverID);
}

// creates a embed messagetemplate for succeded actions
async function messageBanSuccess(client, channelID, body) {
  const channel = await client.channels.get(channelID);
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, channel, body, 'A user has been banned!', 4296754, false);
}

// creates a embed messagetemplate for failed actions
async function messageBannedUserInGuild(client, channelID, userTag, userID, serverName) {
  const channel = await client.channels.get(channelID);
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, channel,
      `tag: \`${userTag}\`
      ID: \`${userID}\`
      For more information use \`${config.prefix}lookup ${userID}\``,
      `A user on your server has been banned on '${serverName}'!`,
      16739072, false);
}


module.exports.run = async (guild, user) => {
  // outside of ban due to following code
  const userID = user.id;
  const userTag = user.tag;
  // getting newly added ban
  guild.fetchBan(user)
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
      }).catch(errHander);
      // check if entry is already on DB
      if (await !banEntry.isNewRecord) {
        // update DB entry
        Ban.update({ reason: fixedReason, userTag, userBanned },
          { where: { userTag, userID, serverID } })
          .catch(errHander);
      }
      const bannedGuild = await getServerEntry(user.client, serverID);
      messageBanSuccess(user.client, bannedGuild.logChannelID, `User \`${userTag}\` with the ID \`${userID}\` has been banned from this server. The ban has been recorded and other servers are getting warned!`);
    });
  user.client.guilds.forEach(async (toTestGuild) => {
    if (guild.id === toTestGuild.id) return;
    const serverMember = toTestGuild.members.get(user.id);
    if (serverMember) {
      const serverID = toTestGuild.id;
      const infectedGuild = await getServerEntry(user.client, serverID);
      messageBannedUserInGuild(user.client, infectedGuild.logChannelID, userTag, userID, guild.name);
    }
  });
};

module.exports.help = {
  name: 'EVENT_guildBanAdd',
};
