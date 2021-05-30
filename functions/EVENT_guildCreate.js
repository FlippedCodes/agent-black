const Ban = require('../database/models/Ban');

const ParticipatingServer = require('../database/models/ParticipatingServer');

const config = require('../config/main.json');

const errHandler = (err) => {
  console.error('ERROR:', err);
};

// checks if server is participating server
function getServerEntry(client, serverID) {
  return client.functions.get('FUNC_checkServer').run(serverID, true);
}

async function addServerEntry(serverID, serverName) {
  await ParticipatingServer.findOrCreate({ where: { serverID, serverName } }).catch(errHandler);
}

module.exports.run = async (client, guild) => {
  const serverID = guild.id;
  if (!await getServerEntry(client, serverID)) await addServerEntry(serverID, guild.name);
  // add all bans to DB
  const allBans = await guild.fetchBans(true);
  allBans.forEach(async ({ user, reason }) => {
    // FIXME: Some emojis in names cant be stored in DB
    const regex = config.emojiLayout;
    const userTag = user.tag.replace(regex, 'X');
    const userBanned = true;
    const userID = user.id;
    let fixedReason = reason;
    if (reason !== null) fixedReason = reason.replace(new RegExp('\'', 'g'), '`');
    const [banEntry] = await Ban.findOrCreate({
      where: { userID, serverID },
      defaults: { reason: fixedReason, userTag, userBanned },
    }).catch(errHandler);
    if (!banEntry.isNewRecord) {
      Ban.update({ reason: fixedReason, userBanned },
        { where: { userID, serverID } })
        .catch(errHandler);
    }
  });
};

module.exports.help = {
  name: 'EVENT_guildCreate',
};
