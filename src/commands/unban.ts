const { SlashCommandBuilder } = require('@discordjs/builders');

const { CommandInteraction } = require('discord.js');

/**
 * @param { CommandInteraction } interaction
 */

module.exports.run = async (interaction) => {
  // check MANAGE_GUILD permissions
  if (!interaction.memberPermissions.has('BAN_MEMBERS')) {
    messageFail(interaction, `You are not authorized to use \`/${module.exports.data.name}\``);
    return;
  }
  const guild = interaction.guild;
  // TODO: Filter the reason - update event-guildBanRemove
  // const reason = options.getString('reason');

  const user = interaction.options.getUser('user');

  // Existing ban?
  // FIXME: Bad implementation of catch()
  const existingBan = await guild.bans.fetch(user).catch((e) => e);
  if (existingBan.code) return messageFail(interaction, 'That user is not banned.');
  // unban user
  await guild.bans.remove(user);
  messageSuccess(interaction, `\`${user.tag}\` has been unbanned!`);
};

module.exports.data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('Unbans a user.')
  .addUserOption((option) => option.setName('user').setDescription('Provide a user.').setRequired(true));
