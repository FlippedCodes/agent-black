import { ChannelType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { CmdFileArgs } from '../typings/Extensions.js';

export const ephemeral = true;
export const data = new SlashCommandBuilder()
  .setName('guild')
  .setDescription('Manages your server')
  .addSubcommand((subcommand) => {
    return subcommand
      .setName('setup')
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
          .setName('staff_role')
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
  })
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);
export async function execute({ client, interaction, options }: CmdFileArgs) {
  await client.commands.get(`guild_${options.getSubcommand()}`).execute({ client, interaction, options });
  return;
}
