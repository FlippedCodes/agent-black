const { MessageEmbed } = require('discord.js');

module.exports.run = async (user, channel, body, title, color, footer) => {
  // needs to be local as settings overlap from dofferent embed-requests
  const embed = new MessageEmbed();

  if (body) embed.setDescription(body);
  if (title) embed.setTitle(title);
  if (color) embed.setColor(color);
  if (footer) embed.setFooter({ text: footer });

  return channel.send(embed);
};

module.exports.help = {
  name: 'FUNC_richEmbedMessage',
};
