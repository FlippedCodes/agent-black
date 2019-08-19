const { RichEmbed } = require('discord.js');

const rp = require('request-promise');

const fs = require('fs');

const uri = 'https://discordapp.com/api/users/';

let tokenAPI;

if (fs.existsSync('./config/test_token.json')) {
  const api = require('../config/test_token.json');
  tokenAPI = api.token;
} else {
  tokenAPI = process.env.APItoken;
}

module.exports.run = async (client, message, args, DB, config) => {
  if (!config.env.get('isTeam')) return message.react('❌');

  let [id] = args;

  if (!id) return message.channel.send('Please provide ID!');

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
      // TODO: Create image endingfinder
      // let avatar = `https://cdn.discordapp.com/avatars/172031697355800577/a_6c8c60b9e5def254160f249bb195c605.gif`;
      let creationDate = (user.id / 4194304) + 1420070400000;
      let embed = new RichEmbed()
        .setAuthor(`Usertag: ${user.username}#${user.discriminator}`)
        .setColor(message.member.displayColor)
        // .setThumbnail(member.user.displayAvatarURL)
        .addField('Account Creation Date', new Date(creationDate), true)
        .setFooter(client.user.tag, client.user.displayAvatarURL)
        .setTimestamp();
      message.channel.send({ embed });
    });
  // joined servers
  // banned servers
  // userinfo through discord api
};

module.exports.help = {
  name: 'lookup',
};
