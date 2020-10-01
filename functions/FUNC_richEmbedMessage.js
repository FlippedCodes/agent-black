const { MessageEmbed } = require('discord.js');

module.exports.run = async (user, channel, body, title, color, footer) => {
  // needs to be local as settings overlap from dofferent embed-requests
  const embed = new MessageEmbed();

  if (footer) {
    embed
      .setFooter(user.tag, user.displayAvatarURL)
      .setTimestamp();
  }
  if (body) embed.setDescription(body);
  if (title) embed.setTitle(title);
  if (color) embed.setColor(color);

  return channel.send(embed);
};

module.exports.help = {
  name: 'FUNC_richEmbedMessage',
};
