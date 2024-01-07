import { SlashCommandBuilder } from 'discord.js';
import { CmdFileArgs } from '../typings/Extensions.js';

export const ephemeral = true;
export const data = new SlashCommandBuilder()
  .setName('broadcast')
  .setDescription('Broadcasts a message to all participating servers')
  .addNumberOption((option) => {
    return option.setName('type').setDescription('Type of message').setRequired(true).setChoices(
      {
        name: 'Broadcast',
        value: 0x6699ff
      },
      {
        name: 'Maintenance',
        value: 0x77b300
      },
      {
        name: 'Security Alert',
        value: 0xff0000
      },
      {
        name: 'Other',
        value: 0x000000
      }
    );
  })
  .addStringOption((option) => {
    return option.setName('message').setDescription('Content to message to servers').setRequired(true);
  });
export async function execute({ client, interaction, options }: CmdFileArgs): Promise<void> {
  const kind = options.getNumber('type', true);
  const dbUser = await client.models.user.findOne({
    where: { userId: interaction.user.id }
  });
  if (!dbUser) {
    await interaction.editReply({
      content: 'You are not authorized to use this command'
    });
    return;
  }
  const flags = dbUser.flags;
  if (!flags.has('Maintainer')) {
    await interaction.editReply({
      content: 'You are not authorized to use this command'
    });
    return;
  }
  // Clean body
  const body = options.getString('message', true).replace(/\\n/g, '\n');
  // Send message
  client.functions.get('utils_masterMessage').execute(client, kind, body);
  interaction.editReply({ content: 'Messages are being sent!' });
}
