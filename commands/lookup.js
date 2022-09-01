const { Op } = require('sequelize');

const { EmbedBuilder, MessageActionRow, MessageButton } = require('discord.js');

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
  const embed = new EmbedBuilder().setColor(interaction.member.displayColor);
  const discordUser = await client.users.fetch(userID, false);
  // get all server that the bot shares with the user
  const sharedServers = await client.guilds.cache.filter((guild) => !!guild.members.cache.get(discordUser.id));
  // There seems to be a bug on the discord api that doesnt allow intigers in body: 'RangeError [EMBED_FIELD_NAME]: EmbedBuilder field names must be non-empty strings.' So a convertion needed to be done
  embed
    .addField('Usertag', `\`${discordUser.tag}\` ${discordUser.bot ? config.commands.lookup.botBadge : ''}`)
    .addField('ID', `\`${userID}\``)
    .addField('Account Creation Date', date(discordUser.createdAt), true)
    .setThumbnail(discordUser.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }));
  if (bans) embed.addField('Bans', `${bans}`, true);
  if (warns) embed.addField('Warns', `${warns}`, true);
  if (sharedServers.size) {
    // FIXME: check if it really only shows one server
    const serverlist = sharedServers.map((sharedMember) => sharedMember.name).join('\n');
    const cutServerlist = serverlist.length > 1024 ? `${serverlist.slice(0, 1021)}...` : serverlist;
    let serverList = `\`\`\`${cutServerlist}\`\`\``;
    // hide serverlist for bot if not maintainer
    if (userID === client.user.id) {
      if (!await client.functions.get('CHECK_DB_perms').run(interaction.user.id)) serverList = 'REDACTED';
    }
    embed.addField(`Shared servers - ${sharedServers.size}`, serverList, false);
  }
  return reply(interaction, { embeds: [embed] }, followUp);
  // }
}

async function getBanns(userID) {
  // adds a user to the Maintainer table
  const found = await Ban.findAll({ where: { userID } })
    .catch(ERR);
  return found;
}

async function getWarns(userID) {
  // adds a user to the Maintainer table
  const found = await Warn.findAll({ where: { userID } })
    .catch(ERR);
  return found;
}

async function getServerName(serverID) {
  // adds a user to the Maintainer table
  const found = await ParticipatingServer.findOne({ where: { serverID } })
    .catch(ERR);
  if (!found) return 'unknown server';
  return found.serverName;
}

// final ban posting function
function postBans(interaction, banns) {
  banns.forEach(async (ban) => {
    const embed = new EmbedBuilder()
      .setDescription(`**Reason**:\n\`\`\`${ban.reason || 'None'}\`\`\``)
      .addField('ServerID', `\`${ban.serverID}\``, true)
      .addField('Is banned', `\`${ban.userBanned}\``, true)
      .addField('BanID', `\`${ban.banID}\``, true)
      .addField('Ban creation date', date(ban.createdAt));
    if (date(ban.createdAt) !== date(ban.updatedAt)) embed.addField('Ban updated date', date(ban.updatedAt));
    const serverName = await getServerName(ban.serverID);
    // check if user is still banned
    if (ban.userBanned) {
      embed
        .setColor('ORANGE') // orange
        .setAuthor({ name: `Banned on ${serverName}` });
    } else {
      embed
        .setColor('GREEN') // green
        .setAuthor({ name: `Was banned on ${serverName}` });
    }
    reply(interaction, { embeds: [embed] }, true);
  });
}

// final warn posting function
function postWarns(interaction, warns) {
  warns.forEach(async (warn) => {
    const serverName = await getServerName(warn.serverID);
    const embed = new EmbedBuilder()
      .setColor(16755456) // yellow
      .setDescription(`**Reason**:\n\`\`\`${warn.reason || 'None'}\`\`\``)
      .setAuthor({ name: `Warned on ${serverName}` })
      .addField('ServerID', `\`${warn.serverID}\``, true)
      .addField('WarnID', `\`${warn.warnID}\``, true)
      .addField('Warning creation date', date(warn.createdAt));
    if (date(warn.createdAt) !== date(warn.updatedAt)) embed.addField('Warning updated date', date(warn.updatedAt));
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
    .catch(ERR);
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

async function showAdditionalUsers(interaction, IDArr, orgID) {
  const message = await new EmbedBuilder()
    .setDescription(`Show all (+${IDArr.length - 1}) results?`)
    .setColor('ORANGE');
  const confirmMessage = await reply(interaction, {
    embeds: [message], components: [buttons], fetchReply: true,
  });
  // start button collector
  const filter = (i) => interaction.user.id === i.user.id;
  const buttonCollector = confirmMessage.createMessageComponentCollector({ filter, time: 20000 });
  buttonCollector.on('collect', async (used) => {
    buttonCollector.stop();
    if (used.customId === 'show') {
      // post all bans besides orginal userID
      // FIXME: bad implementation of a array filter
      IDArr.forEach(async (ID) => {
        if (ID !== orgID) postLookup(interaction, ID, true);
      });
    }
    message.setFooter({ text: `Answered with '${used.component.label}'` });
    confirmMessage.edit({ embeds: [message], components: [] });
  });
  buttonCollector.on('end', async (collected) => {
    if (collected.size !== 0) return;
    message.setFooter({ text: 'Your response took too long. Please run the command again.' });
    confirmMessage.edit({ embeds: [message], components: [] });
  });
}

module.exports.run = async (interaction) => {
  // check permissions if user has teamrole
  if (!await client.functions.get('CHECK_DB_perms').run(interaction.user.id, 'staff', interaction.guild.id, interaction.member)) {
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
    const output = await client.functions.get('GET_DB_alias').run(IDArr[0]);
    if (output) IDArr = output;
  }

  const multipleAccounts = IDArr.length !== 1;
  if (multipleAccounts) await showAdditionalUsers(interaction, IDArr, orgID);
  // only post the one that has the orginal user id
  // FIXME: bad implementation of a array filter
  IDArr.forEach(async (ID, i) => {
    if (ID === orgID) postLookup(interaction, ID, multipleAccounts);
  });
};

module.exports.data = new CmdBuilder()
  .setName('lookup')
  .setDescription('Uses the Discord API and ABB database to look up user information.')
  .addUserOption((option) => option.setName('user').setDescription('Provide a user or a user id.').setRequired(true));
