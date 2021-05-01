const ParticipatingServer = require('../database/models/ParticipatingServer');

const Ban = require('../database/models/Ban');

async function getBanns(userID) {
  // adds a user to the Maintainer table
  const found = await Ban.findAll({ where: { userID } })
    .catch((err) => console.error(err));
  return found;
}

// send message when user is banned
async function sendBanMessage(prefix, message, serverName, serverID, userID, userTag) {
  const client = message.client;
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel,
      `serverID: \`${serverID}\`
      servername: \`${serverName}\`
      userID: \`${userID}\`
      username: \`${userTag}\``,
      '',
      16739072, `For more information use \`${prefix}lookup ${userID}\``);
}

async function getServerName(serverID) {
  // adds a user to the Maintainer table
  const found = await ParticipatingServer.findOne({ where: { serverID } })
    .catch((err) => console.error(err));
  if (!found) return 'unknown server';
  return found.serverName;
}

function postBans(allBans, prefix, message) {
  allBans.forEach(async (foundBan) => {
    const serverID = foundBan.serverID;
    sendBanMessage(prefix, message, await getServerName(serverID), serverID, foundBan.userID, foundBan.userTag);
  });
}

module.exports.run = async (client, message, args, config, prefix) => {
  // check permissions
  if (!await client.functions.get('FUNC_checkPermissionsChannel').run(message.member, message, 'BAN_MEMBERS')) {
    messageFail(message, `You are not authorized to use \`${prefix}${module.exports.help.name}\``);
    return;
  }
  // get all userIDs
  const IDs = [];
  message.guild.members.cache.map((user) => IDs.push(user.id));
  // get all user bans
  const allBans = await getBanns(IDs);
  if (allBans.length === 0) return messageSuccess(message, 'Your server is clear! No users banned on other servers have been found.');
  // check if up to 5 entries
  if (allBans.length < 5) return postBans(allBans, prefix, message);
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
        return postBans(allBans, prefix, message);
      default:
        // wrong reaction
        return messageFail(message, 'Please only choose one of the two options! Try again.');
    }
  });
  reactionCollector.on('end', () => confirmMessage.delete());
};

module.exports.help = {
  name: 'checkallusers',
  desc: 'Checks all users in current server, if found on banlist',
};
