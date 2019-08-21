const { RichEmbed } = require('discord.js');

const config = require('../config/main.json');

module.exports.run = async (message, eventname, eventdescription, color) => {
  let embed = new RichEmbed()
    .setTitle(`${eventname}-event!`)
    .setURL(message.url)
    .setColor(color || message.member.displayColor)
    .setDescription(eventdescription)
    .addField('Triggered by', message.author.tag, true)
    .addField('User ID', `\`${message.author.id}\``, true)
    .addField('Message', `\`\`\`${message.cleanContent}\`\`\``, false)
    .addField('Message ID', `\`${message.id}\``, true)
    .setFooter(message.client.user.tag, message.client.user.displayAvatarURL)
    .setTimestamp();
  message.guild.channels.get(config.logChannel).send({ embed });
};

module.exports.help = {
  name: 'eventlogger',
};
