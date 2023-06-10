import { CommandInteraction, CommandInteractionOptionResolver } from 'discord.js';
import { CustomClient } from '../../typings/Extensions.ts';

export default async function remove(
  client: CustomClient,
  interaction: CommandInteraction,
  options: CommandInteractionOptionResolver
): Promise<void> {
  const dbAlias = await client.models?.Alias.findOne({
    where: { aliasId: options.getString('aliasId', true) }
  });
  if (!dbAlias) {
    interaction.editReply({
      content: 'The alias you attempted to remove does not exist'
    });
    return Promise.resolve();
  }
  // Delete the alias
  await dbAlias.destroy();
  interaction.editReply({
    content: `Success! Alias \`${dbAlias.aliasId}\` has been removed`
  });
}
