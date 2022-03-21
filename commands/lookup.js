const { messageFail } = require('../functions_old/GLBLFUNC_messageFail.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { reply } = require('../functions/globalFuncs.js');
const config = require('../config.json');

const Ban = require('../database/models/Ban');

const Warn = require('../database/models/Warn');

const ParticipatingServer = require('../database/models/ParticipatingServer');

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
      .setLabel('Nah, I\'m good')
      .setStyle('SECONDARY'),
  ]);

async function postUserinfo(client, interaction, userID, bans, warns, followUp = false) {
  const embed = new MessageEmbed().setColor(interaction.member.displayColor);
  const discordUser = await client.users.fetch(userID, false);
  // get all server that the bot shares with the user
  const sharedServers = await client.guilds.cache.filter((guild) => !guild.members.cache.get(discordUser.id));
  // DEPRECATED: post userinfo if no errors accour
  // if (!failed) {
  embed
    .addField('Usertag', `\`${discordUser.tag}\` ${discordUser.bot ? config.lookupBotBadge : ''}`)
    .addField('ID', `\`${userID}\``)
    .addField('Account Creation Date', `<t:${discordUser.createdTimestamp}:F>`, true)
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

async function postLookup(client, interaction, ID, followUp) {
  const bans = await getBanns(ID);
  const warns = await getWarns(ID);
  await postUserinfo(client, interaction, ID, bans.length, warns.length, followUp);
  await postInfractions(interaction, bans, warns);
}

async function showAdditionalUsers(client, interaction, IDArr, orgID) {
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
    if (collected.size === 0) messageFail(client, interaction, 'Your response took too long. Please run the command again.');
  });
}

module.exports.run = async (client, interaction) => {
  // check permissions if user has teamrole
  if (!await client.functions.get('CHECK_DB_perms').run(interaction.user.id, 'staff', interaction.guild.id, interaction.member)) {
    messageFail(client, interaction, `You are not authorized to use \`/${module.exports.data.name}\``);
    return;
  }

  const requestedUser = interaction.options.getUser('user');
  let IDArr = [requestedUser.id];

  const orgID = IDArr[0];
  // check for aliases and overwrite array
  // if not needed of upper code is DEPRECATED:
  if (IDArr.length === 1) {
    const output = await client.functions.get('GET_DB_alias').run(IDArr[0]);
    if (output) IDArr = output;
  }

  if (IDArr.length !== 1) await showAdditionalUsers(client, interaction, IDArr, orgID);
  // only post the one that has the orginal user id
  const res = await IDArr.find(i => i === orgID);
  postLookup(client, interaction, res, true);
};

module.exports.data = new SlashCommandBuilder()
  .setName('lookup')
  .setDescription('Uses the Discord API and ABB database to look up user information.')
  .addUserOption((option) => option.setName('user').setDescription('Provide a user or a user id.').setRequired(true));
