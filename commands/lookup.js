const { MessageEmbed } = require('discord.js');

const fs = require('fs');

let tokenAPI;

if (fs.existsSync('./config/config.json')) {
  const api = require('../config/config.json');
  tokenAPI = api.token;
} else {
  tokenAPI = process.env.BotTokenAgentBlack;
}

module.exports.run = async (client, message, args, config) => {
  if (!config.env.get('isTeam')) return message.react('❌');

  let [userID] = args;
  if (!userID) userID = message.author.id;

  const embed = new MessageEmbed().setColor(message.member.displayColor);
  const discordUser = await client.users.fetch(userID, false)
    .catch((err) => {
      if (err.code === 10013) embed.setAuthor('This user doesn\'t exist.');
      else embed.setAuthor('An error occurred!');
      embed.addField('Stopcode', err.message);
      return message.channel.send({ embed });
    });
  embed
    .addField('Usertag', `\`${discordUser.tag}\``)
    .addField('ID', `\`${userID}\``)
    .addField('Account Creation Date', discordUser.createdAt, true)
    .setThumbnail(discordUser.avatarURL);
  message.channel.send({ embed });
};

module.exports.help = {
  name: 'lookup',
  usage: 'USERID',
  desc: 'Uses the Discord API to lookup userinformaiton',
};
