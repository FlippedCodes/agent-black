import { CmdFileArgs } from '../../typings/Extensions.js';

export const name = 'update';
export async function execute({ client, interaction, options }: CmdFileArgs): Promise<void> {
  if (
    options.getUser('user', true).id === options.getUser('alias', true).id ||
    options.getUser('user', true).id === interaction.user.id ||
    options.getUser('alias', true).id === interaction.user.id
  ) {
    interaction.editReply({ content: 'You cannot alias yourself or the same two users' });
    return;
  }
  // -- //
  const dbAlias = await client.models.alias.findOne({
    where: { aliasId: options.getString('target', true) }
  });
  if (!dbAlias) {
    interaction.editReply({
      content: 'The alias you attempted to update does not exist'
    });
    return;
  }
  // Set the new alias
  dbAlias.alternative = options.getUser('alias', true).id;
  dbAlias.moderator = interaction.user.id;
  await dbAlias.save();
  interaction.editReply({
    content: `Success! Alias \`${dbAlias.aliasId}\` has been updated`
  });
}
