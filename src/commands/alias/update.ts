import { CustomClient } from '../../typings/Extensions.ts';
import { CommandInteraction, CommandInteractionOptionResolver } from 'discord.js';

export default async function (
  client: CustomClient,
  interaction: CommandInteraction,
  options: CommandInteractionOptionResolver
): Promise<void> {
  const dbAlias = await client.models?.Alias.findOne({
    where: { aliasId: options.getString('aliasId', true) }
  });
  if (!dbAlias) {
    interaction.editReply({
      content: 'The alias you attempted to update does not exist'
    });
    return Promise.resolve();
  }
  // Set the new alias
  dbAlias.alternative = options.getUser('alias', true).id;
  dbAlias.moderator = interaction.user.id;
  await dbAlias.save();
  interaction.editReply({
    content: `Success! Alias \`${dbAlias.aliasId}\` has been updated`
  });
}
