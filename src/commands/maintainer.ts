import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from '../typings/Extensions.js';

export const name = 'maintainer';
export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('Manages the maintainers [STAFF ONLY]')
  .addUserOption((option) => option.setName('user').setDescription('Target user').setRequired(true))
  .addStringOption((option) =>
    option
      .setName('action')
      .setDescription('What do you want to do with this user?')
      .addChoices(
        {
          name: 'Add maintainer',
          value: 'add'
        },
        {
          name: 'Remove maintainer',
          value: 'remove'
        },
        {
          name: 'Display info about user',
          value: 'info'
        }
      )
      .setRequired(true)
  );
export async function run(
  client: CustomClient,
  interaction: ChatInputCommandInteraction,
  options: ChatInputCommandInteraction['options']
): Promise<void> {
  const u = await client.models.user.findOne({ where: { userId: interaction.user.id } });
  if (!u || !u.flags.has('Moderator')) {
    interaction.editReply({ content: 'You are not authorised to use this command' });
    return;
  }
  // -- //
  const act = options.getString('action', true);
  if (act !== 'info' && !u.flags.has('Owner')) {
    interaction.editReply({ content: 'You are not authorised to use perform that action' });
    return;
  }
  // -- //
  client.commands.get(`${name}_${act}`).run(client, interaction, options);
}
