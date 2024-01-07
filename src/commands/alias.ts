import { SlashCommandBuilder } from 'discord.js';
import { CmdFileArgs } from '../typings/Extensions.js';

export const ephemeral = true;
export const data = new SlashCommandBuilder()
  .setName('alias')
  .setDescription('Creates, updates, or removes an alias for a user')
  .addSubcommand((subcommand) => {
    return subcommand
      .setName('add')
      .setDescription('Adds an alias for a user')
      .addUserOption((option) => {
        return option.setName('user').setDescription('Primary user').setRequired(true);
      })
      .addUserOption((option) => {
        return option.setName('alias').setDescription('Alternative account').setRequired(true);
      });
  })
  .addSubcommand((subcommand) => {
    return subcommand
      .setName('update')
      .setDescription('Updates an alias')
      .addUserOption((option) => {
        return option.setName('target').setDescription('Alias ID in the database').setRequired(true);
      })
      .addUserOption((option) => {
        return option.setName('alias').setDescription('New alternative account').setRequired(true);
      });
  })
  .addSubcommand((subcommand) => {
    return subcommand
      .setName('remove')
      .setDescription('Deletes an alias from the database')
      .addStringOption((option) => {
        return option.setName('alias').setDescription('Alias ID to delete').setRequired(true);
      });
  });
export async function execute({ client, interaction, options }: CmdFileArgs): Promise<void> {
  // If they don't have the staff role, they can't use this command
  if (!(await client.functions.get('utils_guildAuth').execute(client, interaction.member))) {
    interaction.editReply({
      content: 'You are not authorized to use this command'
    });
    return;
  }
  await client.commands
    .get(`${interaction.commandName}_${options.getSubcommand()}`)
    .execute({ client, interaction, options });
  return;
}
