const { SlashCommandBuilder } = require('@discordjs/builders');
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const { reply } = require('../functions/globalFuncs.js');

/**
 * @param {Client} client 
 * @param {CommandInteraction} interaction
 */
module.exports.run = async (client, interaction) => {
  const embed = new MessageEmbed()
    .setTitle('Halp')
    .setColor(interaction.member.displayColor)
    .setDescription('This command is deprecated, please use discord embedded slash-commands feature instead.')
    .addField('Still need help?', `
  Read the wiki here: https://github.com/FlippedCode/agent-black/wiki
  or join our server here: https://discord.gg/QhfnAWgEMS`);
  return reply(interaction, { embeds: [embed] });
};

module.exports.data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Shows a list of commands. [Deprecated]');
