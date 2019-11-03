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

  let [id] = args;

  if (!id) return message.channel.send('Please provide ID!');

  let embed = new RichEmbed()
    .setColor(message.member.displayColor)
    .setFooter(client.user.tag, client.user.displayAvatarURL)
    .setTimestamp();

  let request = {
    method: 'GET',
    uri: `${uri}${id}`,
    headers: {
      Authorization: `Bot ${tokenAPI}`,
    },
    json: true,
  };
  rp(request)
    .then((user) => {
      let creationDate = (user.id / 4194304) + 1420070400000;
      embed
        .addField('Usertag', `\`${user.username}#${user.discriminator}\``)
        .addField('ID', `\`${user.id}\``)
        .addField('Account Creation Date', new Date(creationDate), true)
        .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`);
      message.channel.send({ embed });
    })
    .catch((err) => {
      if (err.statusCode === 404) embed.setAuthor('This user doesn\'t exist.');
      else embed.setAuthor('An error occurred!');
      embed.addField('Stopcode', err.message);
      message.channel.send({ embed });
    });
  // joined servers with dates on reaction press, if to many (use .length)
  // banned servers with dates on reaction press, if to many (use .length)
  // userinfo through discord api
};

module.exports.help = {
  name: 'lookup',
  desc: 'Uses the Discord API to lookup userinformaiton',
};
