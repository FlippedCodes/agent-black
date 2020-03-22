const { RichEmbed } = require('discord.js');

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

  const [userID] = args;
  if (!userID) return message.channel.send('Please provide an ID!');

  const embed = new RichEmbed().setColor(message.member.displayColor);
  const discordMember = await client.fetchUser(userID, false)
    .catch((err) => {
      if (err.code === 10013) embed.setAuthor('This user doesn\'t exist.');
      else embed.setAuthor('An error occurred!');
      embed.addField('Stopcode', err.message);
      return message.channel.send({ embed });
    });
  embed
    .addField('Usertag', `\`${discordMember.tag}\``)
    .addField('ID', `\`${userID}\``)
    .addField('Account Creation Date', discordMember.createdAt, true)
    .setThumbnail(discordMember.avatarURL);
  message.channel.send({ embed });
};

module.exports.help = {
  name: 'lookup',
  usage: 'USERID',
  desc: 'Uses the Discord API to lookup userinformaiton',
};
