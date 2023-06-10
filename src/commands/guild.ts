import {
  ChannelType,
  CommandInteraction,
  CommandInteractionOptionResolver,
  PermissionFlagsBits,
  PermissionsBitField,
  SlashCommandBuilder
} from 'discord.js';
import { CustomClient } from '../typings/Extensions.ts';

export const name = 'guild';
export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('Manages your server')
  .addSubcommand((subcommand) => {
    return subcommand
      .setName(name)
      .setDescription('Sets up your server with the bot')
      .addChannelOption((option) => {
        return option
          .setName('staff_channel')
          .setDescription('Channel to log known users that staff can see')
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true);
      })
      .addRoleOption((option) => {
        return option
          .setName('authorised_role')
          .setDescription('Role that is required when running staff-only commands')
          .setRequired(true);
      });
  })
  .addSubcommand((subcommand) => {
    return subcommand.setName('enable').setDescription('Enables the bot in the guild');
  })
  .addSubcommand((subcommand) => {
    return subcommand.setName('disable').setDescription('Disables the bot in the guild');
  })
  .addSubcommand((subcommand) => {
    return subcommand.setName('stats').setDescription('Returns statistics of the guild');
  });
export async function run(
  client: CustomClient,
  interaction: CommandInteraction,
  options: CommandInteractionOptionResolver
) {
  await interaction.deferReply({ ephemeral: true });
  if ((interaction.member?.permissions as PermissionsBitField).has(PermissionFlagsBits.ManageGuild)) {
    interaction.editReply({
      content: 'You are not authorised to run this command'
    });
    return Promise.resolve();
  }
  await client.commands?.get(`guild_${options.getSubcommand()}`)?.run(client, interaction, options);
  return Promise.resolve();
}
