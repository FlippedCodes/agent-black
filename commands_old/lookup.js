const { Op } = require('sequelize');

const { MessageEmbed } = require('discord.js');

const config = require('../config/main.json');

const Ban = require('../database/models/Ban');

const Warn = require('../database/models/Warn');

const ParticipatingServer = require('../database/models/ParticipatingServer');

const UserIDAssociation = require('../database/models/UserIDAssociation');

// looksup usertag in list if recorded
async function checkTag(userTag) {
  const found = await UserIDAssociation.findOne({ where: { userTag } })
    .catch(ERR);
  return found;
}

async function postUserinfo(client, message, userID, bans, warns) {
  const embed = new MessageEmbed().setColor(message.member.displayColor);
  let failed = false;
  const discordUser = await client.users.fetch(userID, false)
    .catch((err) => {
      if (err.code === 10013) embed.setAuthor({ name: 'This user doesn\'t exist.' });
      else embed.setAuthor({ name: 'An error occurred!' });
      embed.addField('Stopcode', err.message);
      failed = true;
      return message.channel.send({ embed });
    });
  // get all server that the bot shares with the user
  const sharedServers = await client.guilds.cache.filter((guild) => !!guild.member(discordUser));
  // post userinfo if no errors accour
  if (!failed) {
    let botBadge = '';
    if (discordUser.bot) botBadge = config.lookupBotBadge;
    embed
      .addField('Usertag', `\`${discordUser.tag}\` ${botBadge}`)
      .addField('ID', `\`${userID}\``)
      .addField('Account Creation Date', discordUser.createdAt, true)
      .setThumbnail(discordUser.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }));
    if (bans) embed.addField('Bans', bans, true);
    if (warns) embed.addField('Warns', warns, true);
    if (sharedServers.size) embed.addField(`Shared servers - ${sharedServers.size}`, `\`\`\`${sharedServers.map((sharedMember) => sharedMember.name).join('\n')}\`\`\``, false);
    return message.channel.send({ embed });
  }
}

async function getBanns(userID) {
  // adds a user to the Maintainer table
  const found = await Ban.findAll({ where: { userID } })
    .catch((err) => console.error(err));
  return found;
}

async function getWarns(userID) {
  // adds a user to the Maintainer table
  const found = await Warn.findAll({ where: { userID } })
    .catch((err) => console.error(err));
  return found;
}

async function getServerName(serverID) {
  // adds a user to the Maintainer table
  const found = await ParticipatingServer.findOne({ where: { serverID } })
    .catch((err) => console.error(err));
  if (!found) return 'unknown server';
  return found.serverName;
}

// final ban posting function
function postBans(message, banns) {
  banns.forEach(async (ban) => {
    const embed = new MessageEmbed()
      .setDescription(`**Reason**:\n\`\`\`${ban.reason || 'None'}\`\`\``)
      .addField('ServerID', `\`${ban.serverID}\``, true)
      .addField('Is banned', `\`${ban.userBanned}\``, true)
      .addField('BanID', `\`${ban.banID}\``, true)
      .addField('Ban creation date', ban.createdAt, true)
      .addField('Ban updated date', ban.updatedAt, true);
    const serverName = await getServerName(ban.serverID);
    // check if user is still banned
    if (ban.userBanned) {
      embed
        .setColor(16739072) // orange
        .setAuthor({ name: `Banned on ${serverName}` });
    } else {
      embed
        .setColor(4296754) // green
        .setAuthor({ name: `Was banned on ${serverName}` });
    }
    message.channel.send({ embed });
  });
}

// final warn posting function
function postWarns(message, warns) {
  warns.forEach(async (warn) => {
    const serverName = await getServerName(warn.serverID);
    const embed = new MessageEmbed()
      .setColor(16755456) // yellow
      .setDescription(`**Reason**:\n\`\`\`${warn.reason || 'None'}\`\`\``)
      .setAuthor({ name: `Warned on ${serverName}` })
      .addField('ServerID', `\`${warn.serverID}\``, true)
      .addField('WarnID', `\`${warn.warnID}\``, true)
      .addField('Warning creation date', warn.createdAt, true)
      .addField('Warning updated date', warn.updatedAt, true);
    message.channel.send({ embed });
  });
}

// prepares for bans and warnings from other servers
async function postInfractions(message, bans, warns) {
  postBans(message, bans);
  postWarns(message, warns);
}

function getID(message, args) {
  // check if mention is in content
  if (message.mentions.members.first()) return message.mentions.members.first().id;
  // get userID
  const [userID] = args;
  // check if id argument is present
  if (!userID) return message.author.id;
  // ckeck if content is not NaN
  if (!isNaN(userID)) return userID;
}

async function checkUserTag(uTag, IDArr) {
  // adds a user to the Maintainer table
  // FIXME: lowercase DB search
  const results = await UserIDAssociation.findAll({ limit: 4, where: { userTag: { [Op.substring]: uTag } } })
    .catch((err) => console.error(err));
  if (!results) return;
  results.forEach((result) => {
    if (IDArr.includes(result.userID)) return;
    IDArr.push(result.userID);
  });
  return IDArr;
}

async function postLookup(client, message, ID) {
  const bans = await getBanns(ID);
  const warns = await getWarns(ID);
  await postUserinfo(client, message, ID, bans.length, warns.length);
  await postInfractions(message, bans, warns);
}

module.exports.run = async (client, message, args, config, prefix) => {
  // check permissions if user has teamrole
  if (!await client.functions.get('FUNC_checkPermissionsDB').run(message.author.id, 'staff', message.guild.id, message.member)) {
    messageFail(message, `You are not authorized to use \`${prefix}${module.exports.help.name}\``);
    return;
  }

  let IDArr = [];
  const userID = getID(message, args);
  if (userID) IDArr.push(userID);
  else {
    // parse username
    const userTag = message.content.slice(prefix.length + module.exports.help.name.length + 1);
    // check length
    if (userTag.length < config.commands.lookup.lowerQuerryLimit) return messageFail(message, 'Your search querry must be at least 5 characters long.');
    // make DB search
    await checkUserTag(userTag, IDArr);
  }
  // if no info is given, return author ID
  if (IDArr.length === 0 && args.length === 0) IDArr.push(message.author.id);
  if (IDArr.length === 0 && args.length !== 0) return messageFail(message, 'Couldn\'t find any results with your search querry.');

  const orgID = IDArr[0];
  // check for aliases and overwrite array
  if (IDArr.length === 1) {
    const output = await client.functions.get('FUNC_checkAlias').run(IDArr[0]);
    if (output) IDArr = output;
  }
  // only post the one that has the orginal user id
  IDArr.forEach(async (ID) => {
    if (ID === orgID) postLookup(client, message, ID);
  });
  // if more then 1 entry in array...
  if (IDArr.length !== 1) {
    // ask if rest should be posted
    const confirmMessage = await messageFail(message, `Show all (+${IDArr.length - 1}) results?`, true);
    await confirmMessage.react('❌');
    await confirmMessage.react('✅');
    // start reaction collector
    const filter = (reaction, user) => user.id === message.author.id;
    const reactionCollector = confirmMessage.createReactionCollector(filter, { time: 10000 });
    reactionCollector.on('collect', async (reaction) => {
      reactionCollector.stop();
      switch (reaction.emoji.name) {
        case '❌': return;
        case '✅':
          // post bans
          // post all besides orginal userID
          IDArr.forEach(async (ID) => {
            if (ID !== orgID) postLookup(client, message, ID);
          });
          return;
        default:
          // wrong reaction
          messageFail(message, 'Please only choose one of the two options! Try again.');
          return;
      }
    });
    reactionCollector.on('end', () => confirmMessage.delete());
  }
};

module.exports.data = new CmdBuilder()
  .setName('lookup')
  .setDescription('Uses the Discord API to lookup user information.')
  .addUserOption((option) => option.setName('user').setDescription('Provide a user id or search from the drop down.'))
  .addStringOption((option) => option.setName('search').setDescription('Search database for a user.'));
