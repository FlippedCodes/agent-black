const { MessageEmbed } = require('discord.js');

module.exports.run = async (interaction, body, title, color, footer, ephemeral) => {
  // needs to be local as settings overlap from dofferent embed-requests
  const embed = new MessageEmbed();

  if (body) embed.setDescription(body);
  if (title) embed.setTitle(title);
  if (color) embed.setColor(color);
  if (footer) embed.setFooter(footer);

  return interaction.reply({
    embeds: [embed],
    ephemeral: String(ephemeral) ? ephemeral : true,
  });
};

module.exports.data = {
  name: 'richEmbedMessage',
};
