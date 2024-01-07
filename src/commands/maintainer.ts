import { SlashCommandBuilder } from 'discord.js';
import { CmdFileArgs } from '../typings/Extensions.js';

export const ephemeral = true;
export const data = new SlashCommandBuilder()
  .setName('maintainer')
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
export async function execute({ client, interaction, options }: CmdFileArgs): Promise<void> {
  const act = options.getString('action', true);
  const u = await client.models.user.findOne({ where: { userId: interaction.user.id } });
  if (act !== 'info' && !u.flags.has('Owner')) {
    interaction.editReply({ content: 'You are not authorised to use perform that action' });
    return;
  }
  // -- //
  client.commands.get(`${interaction.commandName}_${act}`).execute({ client, interaction, options });
}
