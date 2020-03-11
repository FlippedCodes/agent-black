const { RichEmbed } = require('discord.js');

const rp = require('request-promise');

const fs = require('fs');

const uri = 'https://discordapp.com/api/users/';

let tokenAPI;

if (fs.existsSync('./config/config.json')) {
  const api = require('../config/config.json');
  tokenAPI = api.token;
} else {
  tokenAPI = process.env.BotTokenAgentBlack;
}

// TODO: make function out of command (more accessable from other commands)

module.exports.run = async (client, message, args, config) => {
  // if (!config.env.get('isTeam')) return message.react('❌');

  const [userID] = args;

  if (!userID) return message.channel.send('Please provide ID!');

  const user = await client.functions.get('FUNC_userLookup').run(userID);

  const embed = new RichEmbed().setColor(message.member.displayColor);

  if (user.err) {
    if (err.statusCode === 404) embed.setAuthor('This user doesn\'t exist.');
    else embed.setAuthor('An error occurred!');
    embed.addField('Stopcode', err.message);
    return message.channel.send({ embed });
  }

  embed
    .addField('Usertag', `\`${user.username}\``)
    .addField('ID', `\`${userID}\``)
    .addField('Account Creation Date', user.creationDate, true)
    .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`);
  message.channel.send({ embed });
};

module.exports.help = {
  name: 'lookup',
  usage: 'USERID',
  desc: 'Uses the Discord API to lookup userinformaiton',
};
