import { ChatInputCommandInteraction } from 'discord.js';
import { CustomClient } from '../../typings/Extensions.js';

export const name = 'add';
export async function run(
  client: CustomClient,
  interaction: ChatInputCommandInteraction,
  options: ChatInputCommandInteraction['options']
): Promise<void> {
  const m = await options.getUser('user');
  const [u] = await client.models.user.findOrCreate({
    where: { userId: m.id }
  });
  if (!u) {
    interaction.editReply({ content: 'Sequelize failed to find or create the staff member' });
    return;
  }
  // -- //
  u.flags.add('Maintainer');
  u.save();
  interaction.editReply({ content: 'Added maintainer' });
}
