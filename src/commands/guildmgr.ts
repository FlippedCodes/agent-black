import { SlashCommandBuilder } from 'discord.js';
import { CmdFileArgs } from '../typings/Extensions.js';
import { StaffFlags } from '../typings/StaffFlags.js';

export const ephemeral = true;
export const data = new SlashCommandBuilder()
  .setName('guildmgr')
  .setDescription('[Maintainer] Manages guilds')
  .addSubcommand((subcommand) => {
    return subcommand
      .setName('add')
      .setDescription('Add guild')
      .addStringOption((option) => {
        return option.setName('server').setDescription('Guild ID to add').setAutocomplete(true).setRequired(true);
      })
      .addStringOption((option) => {
        return option
          .setName('channel')
          .setDescription("Guild's staff channel")
          .setAutocomplete(true)
          .setRequired(true);
      })
      .addStringOption((option) => {
        return option.setName('role').setDescription("Guild's authorised role").setAutocomplete(true).setRequired(true);
      });
  })
  .addSubcommand((subcommand) => {
    return subcommand
      .setName('info')
      .setDescription('Display info about a guild')
      .addStringOption((option) => {
        return option
          .setName('server')
          .setDescription('Guild ID to fetch information for')
          .setAutocomplete(true)
          .setRequired(true);
      });
  })
  .addSubcommand((subcommand) => {
    return subcommand
      .setName('remove')
      .setDescription('Remove guild')
      .addStringOption((option) => {
        return option.setName('server').setDescription('Guild ID to remove').setAutocomplete(true).setRequired(true);
      });
  })
  .addSubcommand((subcommand) => {
    return subcommand
      .setName('block')
      .setDescription('Block guild')
      .addStringOption((option) => {
        return option.setName('server').setDescription('Guild ID to block').setAutocomplete(true).setRequired(true);
      });
  });
export async function execute({ client, interaction, options }: CmdFileArgs): Promise<void> {
  const user = await client.models.user.findOne({ where: { userId: interaction.user.id } });
  if (!user) {
    interaction.editReply({ content: 'You are not authorized to use this command.' });
    return;
  }
  if (!user.flags.has(StaffFlags.Maintainer)) {
    interaction.editReply({ content: 'You are not authorized to use this command.' });
    return;
  }
  await client.commands.get(`guildmgr_${options.getSubcommand(true)}`).execute({ client, interaction, options });
  return;
}
