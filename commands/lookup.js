const { MessageEmbed } = require('discord.js');

const fs = require('fs');

const Ban = require('../database/models/Ban');

const ParticipatingServer = require('../database/models/ParticipatingServer');

let tokenAPI;

if (fs.existsSync('./config/config.json')) {
  const api = require('../config/config.json');
  tokenAPI = api.token;
} else {
  tokenAPI = process.env.BotTokenAgentBlack;
}

async function postUserinfo(client, message, userID) {
  const embed = new MessageEmbed().setColor(message.member.displayColor);
  let failed = false;
  const discordUser = await client.users.fetch(userID, false)
    .catch((err) => {
      if (err.code === 10013) embed.setAuthor('This user doesn\'t exist.');
      else embed.setAuthor('An error occurred!');
      embed.addField('Stopcode', err.message);
      failed = true;
      return message.channel.send({ embed });
    });
  if (!failed) {
    embed
      .addField('Usertag', `\`${discordUser.tag}\``)
      .addField('ID', `\`${userID}\``)
      .addField('Account Creation Date', discordUser.createdAt, true)
      .setThumbnail(discordUser.avatarURL);
    return message.channel.send({ embed });
  }
}

async function getBanns(userID) {
  // adds a user to the Maintainer table
  const found = await Ban.findAll({ where: { userID } })
    .catch((err) => console.error(err));
  return found;
}

async function getServerName(serverID) {
  // adds a user to the Maintainer table
  const found = await ParticipatingServer.findOne({ where: { serverID } })
    .catch((err) => console.error(err));
  return found.serverName;
}

async function postBanns(message, userID) {
  const banns = await getBanns(userID);
  banns.forEach(async (ban) => {
    const embed = new MessageEmbed()
      .addField('ServerID', `\`${ban.serverID}\``, true)
      .addField('Is banned', `\`${ban.userBanned}\``, true)
      .addField('Reason', `\`\`\`${ban.reason || 'None'}\`\`\``)
      .addField('Ban creation date', ban.createdAt, true)
      .addField('Ban updated date', ban.updatedAt, true);
    let serverName = await getServerName(ban.serverID);
    if (!serverName) serverName = 'Unknown';
    // check if user is still banned
    if (ban.userBanned) {
      embed
        .setColor(16739072) // orange
        .setAuthor(`Banned on ${serverName}`);
    } else {
      embed
        .setColor(4296754) // green
        .setAuthor(`Was banned on ${serverName}`);
    }
    message.channel.send({ embed });
  });
}

module.exports.run = async (client, message, args, config) => {
  // check permissions if MANAGE_MESSAGES and if send in DMs
  if (!await client.functions.get('FUNC_checkPermissions').run(message.member, message, 'MANAGE_MESSAGES')) {
    messageFail(client, message, `You are not authorized to use \`${config.prefix}${module.exports.help.name}\``);
    return;
  }

  // get userID
  let [userID] = args;
  if (!userID) userID = message.author.id;

  // not needed, not enough banns
  // const sentMessage = await sendUserinfo(client, message, args);
  await postUserinfo(client, message, userID);
  await postBanns(message, userID);
};

module.exports.help = {
  name: 'lookup',
  usage: 'USERID',
  desc: 'Uses the Discord API to lookup userinformaiton',
};
