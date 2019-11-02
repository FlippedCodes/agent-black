const { RichEmbed } = require('discord.js');

const embed = new RichEmbed();

module.exports.run = async (user, channel, body, title, color, footer) => {
  if (footer) {
    embed
      .setFooter(user.tag, user.displayAvatarURL)
      .setTimestamp();
  }
  if (body) embed.setDescription(body);
  if (title) embed.setTitle(title);
  if (color) embed.setColor(color);

  channel.send(embed);
};

module.exports.help = {
  name: 'FUNC_richEmbedMessage',
};
