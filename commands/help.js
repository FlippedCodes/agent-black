const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, config, prefix) => {
  // prepare title and desc for embed
  const embed = new MessageEmbed()
    .setTitle('Halp')
    .setColor(message.member.displayColor);
  // creating embed fields for every command
  client.commands.forEach((CMD) => {
    embed.addField(
      `\`${prefix}${CMD.help.name} ${CMD.help.usage || ''}\``,
      CMD.help.desc, false,
    );
  });
  embed.addField('Need more help?', `
  Join the help server here: https://discord.gg/QhfnAWgEMS`);
  message.channel.send(embed);
  return;
};

module.exports.help = {
  name: 'help',
  desc: 'Shows a list of commands.',
};
