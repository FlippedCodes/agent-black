import { ChatInputCommandInteraction } from 'discord.js';
import { CustomClient } from '../../typings/Extensions.js';

export const name = 'remove';
export async function run(
  client: CustomClient,
  interaction: ChatInputCommandInteraction,
  options: ChatInputCommandInteraction['options']
): Promise<void> {
  const u = await client.models.user.findOne({ where: { userId: options.getUser('user').id } });
  if (!u) {
    interaction.editReply({ content: 'User is not a member of staff' });
    return;
  }
  if (u.flags.has('Owner') || u.userId === interaction.user.id) {
    interaction.editReply({ content: 'You cannot remove this user' });
    return;
  }
  // -- //
  u.flags.remove('Maintainer');
  u.save();
  interaction.editReply({ content: 'Removed maintainer' });
}
