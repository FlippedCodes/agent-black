const { MessageEmbed } = require('discord.js');

module.exports.run = async (interaction, body, title, color, footer, ephemeral, edit) => {
  // needs to be local as settings overlap from dofferent embed-requests
  const embed = new MessageEmbed();

  if (body) embed.setDescription(body);
  if (title) embed.setTitle(title);
  if (color) embed.setColor(color);
  if (footer) embed.setFooter(footer);

  const options = {
    embeds: [embed],
    ephemeral: String(ephemeral) ? ephemeral : true,
  };

  if (edit === undefined || edit) {
    return interaction.editReply(options).catch(ERR);
  }
  return interaction.reply(options).catch(ERR);
};

module.exports.data = {
  name: 'richEmbedMessage',
};
