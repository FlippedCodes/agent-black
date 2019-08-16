const { RichEmbed } = require('discord.js');

module.exports.run = async (client, message, args, DB, config) => {
  // prepare title and user CMDs
  let embed = new RichEmbed()
    .setTitle('Halp')
    .setColor(message.member.displayColor)
    .addField(
      `\`${config.prefix}help\``,
      'Shows this list of commands', true,
    );

  // set footer
  embed
    .setFooter(message.client.user.tag, message.client.user.displayAvatarURL)
    .setTimestamp();
  message.channel.send({ embed });
  return;
};

module.exports.help = {
  name: 'help',
};
