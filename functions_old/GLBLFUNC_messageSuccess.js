const { MessageEmbed } = require('discord.js');

module.exports.messageSuccess = async (client, interaction, body) => {
  const sentMessage = await interaction.followUp({ embeds: [new MessageEmbed({
    title: '',
    description: body,
    color: 4296754
  })], ephemeral: false });
  return sentMessage;
};
global.messageSuccess = module.exports.messageSuccess();

module.exports.help = {
  name: 'GLBLFUNC_messageSuccess',
};
