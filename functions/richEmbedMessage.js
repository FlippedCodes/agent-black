const { MessageEmbed } = require('discord.js');

module.exports.run = async (interaction, body, title, color, footer, ephemeral) => {
  // needs to be local as settings overlap from dofferent embed-requests
  const embed = new MessageEmbed();

  if (body) embed.setDescription(body);
  if (title) embed.setTitle(title);
  if (color) embed.setColor(color);
  if (footer) embed.setFooter({ text: footer });

  const options = {
    embeds: [embed],
    components: [],
    ephemeral: String(ephemeral) ? ephemeral : true,
  };

  return reply(interaction, options).catch(ERR);
};

module.exports.data = {
  name: 'richEmbedMessage',
};
