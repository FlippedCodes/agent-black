import { Op, UniqueConstraintError } from 'sequelize';
import { CmdFileArgs } from '../../typings/Extensions.js';
import { alias, aliasCreationAttributes } from '../../typings/Models.js';

export const name = 'add';
export async function execute({ client, interaction, options }: CmdFileArgs): Promise<void> {
  const optUser = options.getUser('user', true);
  const optAlias = options.getUser('alias', true);
  // Check if aliasing the same two users
  if (optUser.id === optAlias.id) {
    interaction.editReply({ content: 'You cannot alias the same two users' });
    return;
  }
  // Check if the alias already exists or exists in reverse
  const alias = await client.models.alias.findOne({
    where: {
      [Op.or]: [
        {
          user: optUser.id,
          alternative: optAlias.id
        },
        {
          user: optAlias.id,
          alternative: optUser.id
        }
      ]
    }
  });
  if (alias !== null) {
    interaction.editReply({
      content: 'The alias you attempted to set already exists'
    });
    return;
  }
  // Create the alias
  const attr: aliasCreationAttributes = {
    user: optUser.id,
    alternative: optAlias.id,
    moderator: interaction.user.id
  };
  // Check if alternative has an alias. If so, set the alternative to the primary account
  const alt = await client.models.alias.findOne({ where: { user: optAlias.id } });
  if (alt !== null) {
    attr.user = alt.user;
    attr.alternative = optUser.id;
  }
  // Create and handle the alias
  await client.models.alias.create(attr).then(
    (dbAlias: alias) => {
      if (!dbAlias) {
        interaction.editReply({
          content: 'Failed to create the association in the database. Please try again later'
        });
        return;
      }
      interaction.editReply({
        content: `Success! ${optUser.toString()} has been aliased to ${options
          .getUser('alias', true)
          .toString()} with ID \`${dbAlias.aliasId}\``
      });
    },
    (e: Error) => {
      // Check for UniqueConstraintError
      // Indicates that the user has already been alised to someone else
      if (e instanceof UniqueConstraintError) {
        interaction.editReply({
          content: 'The alternative account you attempted to alias already has an existing primary account'
        });
        return;
      }
      interaction.editReply({
        content: 'An unexpected error occurred while creating the alias. Please try again later'
      });
    }
  );
}
