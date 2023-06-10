import { CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder } from "discord.js";
import { CustomClient } from "../typings/Extensions.ts";
import StaffFlagsBitField from "../typings/StaffFlagsBitField.ts";
import { StaffFlags } from "../typings/StaffFlags.ts";

export const name = 'guildmgr';
export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('[Maintainer] Manages guilds')
  .addSubcommand((subcommand) => {
    return subcommand
      .setName('add')
      .setDescription('Add guild')
      .addStringOption((option) => {
        return option
          .setName('server')
          .setDescription('Guild ID to add')
          .setAutocomplete(true)
          .setRequired(true);
      })
      .addStringOption((option) => {
        return option
          .setName('channel')
          .setDescription('Guild\'s staff channel')
          .setAutocomplete(true)
          .setRequired(true);
      })
      .addStringOption((option) => {
        return option
          .setName('role')
          .setDescription('Guild\'s authorised role')
          .setAutocomplete(true)
          .setRequired(true);
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
        return option
          .setName('server')
          .setDescription('Guild ID to remove')
          .setAutocomplete(true)
          .setRequired(true);
      });
  })
  .addSubcommand((subcommand) => {
    return subcommand
      .setName('block')
      .setDescription('Block guild')
      .addStringOption((option) => {
        return option
          .setName('server')
          .setDescription('Guild ID to block')
          .setAutocomplete(true)
          .setRequired(true);
      });
  });
export async function run(client: CustomClient, interaction: CommandInteraction, options: CommandInteractionOptionResolver): Promise<void> {
  await interaction.deferReply({ ephemeral: true });
  const user = await client.models?.User.findOne({ where: { userId: interaction.user.id } });
  if (!user) {
    interaction.editReply({ content: 'You are not authorized to use this command.' });
    return Promise.resolve();
  }
  const flags = new StaffFlagsBitField(BigInt(user.flags));
  if (!flags.has(StaffFlags.Maintainer)) {
    interaction.editReply({ content: 'You are not authorized to use this command.' });
    return Promise.resolve();
  }
  await client.functions?.get(`guildmgr_${options.getSubcommand(true)}`)?.run(client, interaction, options);
  return Promise.resolve();
}