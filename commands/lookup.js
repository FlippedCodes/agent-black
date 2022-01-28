const { Op } = require('sequelize');

const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const Ban = require('../database/models/Ban');

const Warn = require('../database/models/Warn');

const ParticipatingServer = require('../database/models/ParticipatingServer');

const UserIDAssociation = require('../database/models/UserIDAssociation');

const buttons = new MessageActionRow()
  .addComponents([
    new MessageButton()
      .setCustomId('show')
      .setEmoji('✅')
      .setLabel('Show all users')
      .setStyle('PRIMARY'),
    new MessageButton()
      .setCustomId('dontshow')
      .setEmoji('❌')
      .setLabel('Nah, im good')
      .setStyle('SECONDARY'),
  ]);

// looksup usertag in list if recorded
async function checkTag(userTag) {
  const found = await UserIDAssociation.findOne({ where: { userTag } })
    .catch(ERR);
  return found;
}

async function postUserinfo(interaction, userID, bans, warns, followUp = false) {
  const embed = new MessageEmbed().setColor(interaction.member.displayColor);
  // DEPRECATED: let failed = false;
  const discordUser = await client.users.fetch(userID, false);
  // DEPRECATED: id checking will happen on discords end
  // .catch((err) => {
  //   if (err.code === 10013) embed.setAuthor({ name: 'This user doesn\'t exist.' });
  //   else embed.setAuthor({ name: 'An error occurred!' });
  //   embed.addField('Stopcode', err.message);
  //   failed = true;
  //   return interaction.channel.send({ embed });
  // });
  // get all server that the bot shares with the user
  const sharedServers = await client.guilds.cache.filter((guild) => !!guild.members.cache.get(discordUser.id));
  // DEPRECATED: post userinfo if no errors accour
  // if (!failed) {
  embed
    .addField('Usertag', `\`${discordUser.tag}\` ${discordUser.bot ? config.lookupBotBadge : ''}`)
    .addField('ID', `\`${userID}\``)
    // FIXME: .addField('Account Creation Date', discordUser.createdAt, true)
    .setThumbnail(discordUser.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }));
  if (bans) embed.addField('Bans', bans, true);
  if (warns) embed.addField('Warns', warns, true);
  if (sharedServers.size) embed.addField(`Shared servers - ${sharedServers.size}`, `\`\`\`${sharedServers.map((sharedMember) => sharedMember.name).join('\n')}\`\`\``, false);
  return reply(interaction, { embeds: [embed] }, followUp);
  // }
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
function postBans(interaction, banns) {
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
    reply(interaction, { embeds: [embed] }, true);
  });
}

// final warn posting function
function postWarns(interaction, warns) {
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
    reply(interaction, { embeds: [embed] }, true);
  });
}

// prepares for bans and warnings from other servers
async function postInfractions(interaction, bans, warns) {
  postBans(interaction, bans);
  postWarns(interaction, warns);
}

// function getID(interaction, args) {
//   // check if mention is in content
//   if (interaction.mentions.members.first()) return interaction.mentions.members.first().id;
//   // get userID
//   const [userID] = args;
//   // check if id argument is present
//   if (!userID) return interaction.author.id;
//   // ckeck if content is not NaN
//   if (!isNaN(userID)) return userID;
// }

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

async function postLookup(interaction, ID, followUp) {
  const bans = await getBanns(ID);
  const warns = await getWarns(ID);
  await postUserinfo(interaction, ID, bans.length, warns.length, followUp);
  await postInfractions(interaction, bans, warns);
}

async function showAdditionalUsers(interaction, IDArr) {
  const message = await new MessageEmbed()
    .setDescription(`Show all (+${IDArr.length - 1}) results?`)
    .setColor(16739072);
  const confirmMessage = await reply(interaction, {
    embeds: [message], components: [buttons], fetchReply: true, ephemeral: true,
  });
  // start button collector
  const filter = (i) => interaction.user.id === i.user.id;
  const buttonCollector = confirmMessage.createMessageComponentCollector({ filter, time: 10000 });
  buttonCollector.on('collect', async (used) => {
    buttonCollector.stop();
    if (used.customId === 'show') {
      // post bans
      // post all besides orginal userID
      // FIXME: bad implementation of a array filter
      IDArr.forEach(async (ID) => {
        if (ID !== orgID) postLookup(interaction, ID, true);
      });
    }
  });
  buttonCollector.on('end', async (collected) => {
    if (collected.size === 0) messageFail(interaction, 'Your response took too long. Please run the command again.');
  });
}

module.exports.run = async (interaction) => {
  // check permissions if user has teamrole
  if (!await client.functions.get('CHECK_DBperms').run(interaction.user.id, 'staff', interaction.guild.id, interaction.member)) {
    messageFail(interaction, `You are not authorized to use \`/${module.exports.data.name}\``);
    return;
  }

  const requestedUser = interaction.options.getUser('user');
  let IDArr = [requestedUser.id];
  // if (userID) IDArr.push(userID);
  // else {
  //   // parse username
  //   const userTag = message.content.slice(prefix.length + module.exports.data.name.length + 1);
  //   // check length
  //   if (userTag.length < config.commands.lookup.lowerQuerryLimit) return messageFail(message, 'Your search querry must be at least 5 characters long.');
  //   // make DB search
  //   await checkUserTag(userTag, IDArr);
  // }

  // DEPRECATED: if no info is given, return author ID
  // if (IDArr.length === 0 && args.length === 0) IDArr.push(message.author.id);
  // if (IDArr.length === 0 && args.length !== 0) return messageFail(message, 'Couldn\'t find any results with your search querry.');

  const orgID = IDArr[0];
  // check for aliases and overwrite array
  // if not needed of upper code is DEPRECATED:
  if (IDArr.length === 1) {
    const output = await client.functions.get('GET_alias').run(IDArr[0]);
    if (output) IDArr = output;
  }

  if (IDArr.length !== 1) await showAdditionalUsers(interaction, IDArr);
  // only post the one that has the orginal user id
  // FIXME: bad implementation of a array filter
  IDArr.forEach(async (ID) => {
    if (ID === orgID) postLookup(interaction, ID, true);
  });
};

module.exports.data = new CmdBuilder()
  .setName('lookup')
  .setDescription('Uses the Discord API and ABB database to look up user information.')
  .addUserOption((option) => option.setName('user').setDescription('Provide a user or a user id.').setRequired(true));
