const { messageFail } = require('../functions_old/GLBLFUNC_messageFail.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require('discord.js');
const ParticipatingServer = require('../database/models/ParticipatingServer');

/**
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 * @returns 
 */
module.exports.run = async (client, interaction) => {
  // check maintainer permissions
  if (!await client.functions.get('CHECK_DB_perms').run(interaction.user.id)) {
    messageFail(client, interaction, `You are not authorized to use \`/${module.exports.data.name}\``);
    return;
  }
  const subName = interaction.options.getSubcommand(true);
  const serverID = interaction.options.getString('server');
  client.commands.get(`${module.exports.data.name}_${subName}`).run(interaction, ParticipatingServer, serverID);
};

module.exports.data = new SlashCommandBuilder()
  .setName('guildmgr')
  .setDescription('Manages guilds. [MAINTAINER ONLY]')
  .addSubcommand((SC) => SC
    .setName('add')
    .setDescription('Add guild.')
    .addStringOption((option) => option
      .setName('server')
      .setDescription('Provide a guild ID you want to edit.')
      .setAutocomplete(true)
      .setRequired(true))
    .addStringOption((option) => option
      .setName('channel')
      .setDescription('Provide a channel you want Agent Black to report to.')
      .setAutocomplete(true)
      .setRequired(true))
    .addStringOption((option) => option
      .setName('role')
      .setDescription('Provide your teams role, so the bot know who to listen to.')
      .setAutocomplete(true)
      .setRequired(true)))
  .addSubcommand((SC) => SC
    .setName('info')
    .setDescription('Disply info about a guild.')
    .addStringOption((option) => option
      .setName('server')
      .setDescription('Provide a guild ID you want to edit.')
      .setAutocomplete(true)
      .setRequired(true)))
  .addSubcommand((SC) => SC
    .setName('remove')
    .setDescription('Remove guild.')
    .addStringOption((option) => option
      .setName('server')
      .setDescription('Provide a guild ID you want to edit.')
      .setAutocomplete(true)
      .setRequired(true)))
  .addSubcommand((SC) => SC
    .setName('block')
    .setDescription('Block guild.')
    .addStringOption((option) => option
      .setName('server')
      .setDescription('Provide a guild ID you want to edit.')
      .setAutocomplete(true)
      .setRequired(true)));
