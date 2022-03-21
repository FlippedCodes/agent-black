const { messageFail } = require('../functions_old/GLBLFUNC_messageFail.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const { reply } = require('../functions/globalFuncs.js');

/**
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 * @returns 
 */
module.exports.run = async (client, interaction) => {
  // needs to be local as settings overlap from dofferent embed-requests
  const embed = new MessageEmbed();
  const options = interaction.options;
  // get user and Pic
  const user = options.getUser('user', true);
  // need to be fetched so banner url can be generated
  await user.fetch(true);
  const pic = await user.bannerURL({ format: 'png', dynamic: true, size: 4096 });
  if (!pic) return messageFail(client, interaction, 'This user doesn\'t have a banner.');
  embed.setAuthor({ name: user.tag });
  embed.setImage(pic);

  reply(interaction, { embeds: [embed] });
};

module.exports.data = new SlashCommandBuilder()
  .setName('banner')
  .setDescription('Retrieves the banner of a users profile via user ID.')
  .addUserOption((option) => option.setName('user').setDescription('Provide a user to get the bannner from.').setRequired(true));
