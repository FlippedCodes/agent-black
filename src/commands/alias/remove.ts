import { ChatInputCommandInteraction } from 'discord.js';
import { CustomClient } from '../../typings/Extensions.js';

export const name = 'remove';
export async function run(
  client: CustomClient,
  interaction: ChatInputCommandInteraction,
  options: ChatInputCommandInteraction['options']
): Promise<void> {
  const dbAlias = await client.models.alias.findOne({
    where: { aliasId: options.getString('alias', true) }
  });
  if (!dbAlias) {
    interaction.editReply({
      content: 'The alias you attempted to remove does not exist'
    });
    return;
  }
  // Delete the alias
  await dbAlias.destroy();
  interaction.editReply({
    content: `Success! Alias \`${dbAlias.aliasId}\` has been removed`
  });
}
