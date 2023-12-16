import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from '../typings/Extensions.js';

export const name = 'alias';
export const ephemeral = true;
export const data = new SlashCommandBuilder()
  .setName(name)
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
export async function run(
  client: CustomClient,
  interaction: ChatInputCommandInteraction,
  options: ChatInputCommandInteraction['options']
): Promise<void> {
  const dbUser = await client.models.user.findOne({
    where: { userId: interaction.user.id }
  });
  if (!dbUser || !dbUser.flags.any(['Moderator', 'Maintainer'])) {
    interaction.editReply({
      content: 'You are not authorized to use this command'
    });
    return;
  }
  await client.commands.get(`${name}_${options.getSubcommand()}`).run(client, interaction, options);
  return;
}
