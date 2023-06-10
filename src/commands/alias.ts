import { CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from '../typings/Extensions.ts';

export const name = 'alias';
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
      .addStringOption((option) => {
        return option.setName('alias').setDescription('Alternative account').setRequired(true);
      });
  })
  .addSubcommand((subcommand) => {
    return subcommand
      .setName('update')
      .setDescription('Updates an alias')
      .addStringOption((option) => {
        return option.setName('aliasId').setDescription('Alias ID in the database').setRequired(true);
      })
      .addStringOption((option) => {
        return option.setName('alias').setDescription('New alternative account').setRequired(true);
      });
  })
  .addSubcommand((subcommand) => {
    return subcommand
      .setName('remove')
      .setDescription('Deletes an alias from the database')
      .addUserOption((option) => {
        return option.setName('aliasId').setDescription('Alias ID to delete').setRequired(true);
      });
  });
export async function run(
  client: CustomClient,
  interaction: CommandInteraction,
  options: CommandInteractionOptionResolver
): Promise<void> {
  await interaction.deferReply({ ephemeral: true });
  const dbUser = await client.models?.User.findOne({
    where: { userId: interaction.user.id }
  });
  if (!dbUser || dbUser.flags < 1) {
    interaction.editReply({
      content: 'You are not authorized to use this command'
    });
    return Promise.resolve();
  }
  await client.commands?.get(`${name}_${options.getSubcommand()}`)?.run(client, interaction, options);
  return Promise.resolve();
}
