import { CmdFileArgs } from '../../typings/Extensions.js';

export const name = 'remove';
export async function execute({ client, interaction, options }: CmdFileArgs): Promise<void> {
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
