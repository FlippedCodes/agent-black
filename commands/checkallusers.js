const ParticipatingServer = require('../database/models/ParticipatingServer');

const Ban = require('../database/models/Ban');

async function getBanns(userID) {
  // adds a user to the Maintainer table
  const found = await Ban.findAll({ where: { userID } })
    .catch((err) => console.error(err));
  return found;
}

// send message when user is banned
async function sendBanMessage(config, message, serverName, serverID, userID, userTag) {
  const client = message.client;
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel,
      `serverID: \`${serverID}\`
      servername: \`${serverName}\`
      userID: \`${userID}\`
      username: \`${userTag}\``,
      '',
      16739072, `For more information use \`${config.prefix}lookup ${userID}\``);
}

async function getServerName(serverID) {
  // adds a user to the Maintainer table
  const found = await ParticipatingServer.findOne({ where: { serverID } })
    .catch((err) => console.error(err));
  if (!found) return 'unknown server';
  return found.serverName;
}

function postBans(allBans, config, message) {
  allBans.forEach(async (foundBan) => {
    const serverID = foundBan.serverID;
    sendBanMessage(config, message, await getServerName(serverID), serverID, foundBan.userID, foundBan.userTag);
  });
}

module.exports.run = async (client, message, args, config) => {
  // check permissions
  if (!await client.functions.get('FUNC_checkPermissions').run(message.member, message, 'BAN_MEMBERS')) {
    messageFail(message, `You are not authorized to use \`${config.prefix}${module.exports.help.name}\``);
    return;
  }
  // get all userIDs
  const IDs = [];
  message.guild.members.cache.map((user) => IDs.push(user.id));
  // get all user bans
  const allBans = await getBanns(IDs);
  if (allBans.length === 0) return messageSuccess(message, 'Your server is clear! No users banned on other servers have been found.');
  // check if up to 5 entries
  if (allBans.length < 5) return postBans(allBans, config, message);
  // sends pre waring message
  const confirmMessage = await messageFail(message, `You are about to display ${allBans.length} listed bans! This action can not be stopped midway through. \nAre you sure?`, true);
  await confirmMessage.react('❌');
  await confirmMessage.react('✅');
  // start reaction collector
  const filter = (reaction, user) => user.id === message.author.id;
  const reactionCollector = confirmMessage.createReactionCollector(filter, { time: 10000 });
  reactionCollector.on('collect', async (reaction) => {
    reactionCollector.stop();
    switch (reaction.emoji.name) {
      case '❌':
        // cancel
        return messageFail(message, 'Aborted!', true);
      case '✅':
        messageSuccess(message, 'Starting... Please note, because of Discords API limit, the messages take some time to process.');
        // post bans
        return postBans(allBans, config, message);
      default:
        // wrong reaction
        return messageFail(message, 'Please only choose one othe the two options! Try again.');
    }
  });
  reactionCollector.on('end', () => confirmMessage.delete());
};

module.exports.help = {
  name: 'checkallusers',
  desc: 'Checks all users in current server, if found on banlist',
};
