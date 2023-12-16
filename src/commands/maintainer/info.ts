import { ChatInputCommandInteraction } from 'discord.js';
import { CustomClient } from '../../typings/Extensions.js';

export const name = 'info';
export async function run(
  client: CustomClient,
  interaction: ChatInputCommandInteraction,
  options: ChatInputCommandInteraction['options']
): Promise<void> {
  const m = await options.getUser('user');
  const u = await client.models.user.findOne({ where: { userId: m.id } });
  if (!u) {
    interaction.editReply({ content: 'User is not a member of staff' });
    return;
  }
  // -- //
  interaction.editReply({
    embeds: [
      {
        title: `Staff Information | ` + m.globalName,
        author: {
          name: m.username,
          icon_url: m.displayAvatarURL()
        },
        fields: [
          {
            name: 'Role',
            value: u.flags.has('Owner', false) ? 'Owner' : u.flags.has('Maintainer') ? 'Maintainer' : 'Moderator'
          },
          {
            name: 'Flags',
            value: u.flags.toArray().join(', ')
          },
          {
            name: 'Staff Since',
            value: `<t:${Math.floor(u.createdAt.getTime() / 1000)}:F> (<t:${Math.floor(
              u.createdAt.getTime() / 1000
            )}:R>)`
          }
        ]
      }
    ]
  });
}
