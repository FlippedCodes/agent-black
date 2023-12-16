import { Alias, AliasCreationAttributes } from '../../typings/Models.js';
import { Op, UniqueConstraintError } from 'sequelize';
import { CustomClient } from '../../typings/Extensions.js';
import { ChatInputCommandInteraction } from 'discord.js';

export const name = 'add';
export async function run(
  client: CustomClient,
  interaction: ChatInputCommandInteraction,
  options: ChatInputCommandInteraction['options']
): Promise<void> {
  if (
    options.getUser('user', true).id === options.getUser('alias', true).id ||
    options.getUser('user', true).id === interaction.user.id ||
    options.getUser('alias', true).id === interaction.user.id
  ) {
    interaction.editReply({ content: 'You cannot alias yourself or the same two users' });
    return;
  }
  // Check if the alias already exists or exists in reverse
  const alias = await client.models.alias.findOne({
    where: {
      [Op.or]: [
        {
          user: options.getUser('user', true).id,
          alternative: options.getUser('alias', true).id
        },
        {
          user: options.getUser('alias', true).id,
          alternative: options.getUser('user', true).id
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
  const attr: AliasCreationAttributes = {
    user: options.getUser('user', true).id,
    alternative: options.getUser('alias', true).id,
    moderator: interaction.user.id
  };
  // Check if alternative has an alias. If so, set the alternative to the primary account
  const alt = await client.models.alias.findOne({ where: { user: options.getUser('alias', true).id } });
  if (alt !== null) {
    attr.user = alt.user;
    attr.alternative = options.getUser('user', true).id;
  }
  // Create and handle the alias
  await client.models.alias.create(attr).then(
    (dbAlias: Alias) => {
      if (!dbAlias) {
        interaction.editReply({
          content: 'Failed to create the association in the database. Please try again later'
        });
        return;
      }
      interaction.editReply({
        content: `Success! ${options.getUser('user', true).toString()} has been aliased to ${options
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
