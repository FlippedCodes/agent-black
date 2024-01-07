import { CmdFileArgs } from '../../typings/Extensions.js';

export const name = 'add';
export async function execute({ client, interaction, options }: CmdFileArgs): Promise<void> {
  const m = await options.getUser('user');
  // Find or create the user
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
