const { SlashCommandBuilder } = require('@discordjs/builders');
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const { reply } = require('../functions/globalFuncs.js');

/**
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */
module.exports.run = async (client, interaction) => {
  // needs to be local as settings overlap from dofferent embed-requests
  const embedDefault = new MessageEmbed();
  const command = interaction.options;
  // get user and ID
  const rawUser = command.get('user', true);
  const user = rawUser.user;
  const member = rawUser.member;
  const defaultPFP = user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 });
  embedDefault.setAuthor({ name: user.tag })
    .setImage(defaultPFP);
  await reply(interaction, { embeds: [embedDefault] });

  if (member && member.avatar) {
    const embedServer = new MessageEmbed();
    const serverPFP = member.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 });
    embedServer.setAuthor({ name: member.nickname })
      .setImage(serverPFP)
      .setFooter({ text: 'Server profile picture' });
    interaction.followUp({ embeds: [embedServer] });
  }
};

module.exports.data = new SlashCommandBuilder()
  .setName('avatar')
  .setDescription('Retrieves the profile picture of the provided user ID.')
  .addUserOption((option) => option.setName('user').setDescription('Provide a user to get the avatar from.').setRequired(true));
