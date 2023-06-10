import { Alias, AliasCreationAttributes } from '../../typings/Models.ts';
import { Op, UniqueConstraintError } from 'sequelize';
import { CustomClient } from '../../typings/Extensions.ts';
import { CommandInteraction, CommandInteractionOptionResolver } from 'discord.js';

export default async function add(
  client: CustomClient,
  interaction: CommandInteraction,
  options: CommandInteractionOptionResolver
): Promise<void> {
  // Check if the alias already exists or exists in reverse
  const alias = await client.models?.Alias.findOne({
    where: {
      [Op.or]: [
        {
          alternative: options.getUser('alias', true).id,
          user: options.getUser('user', true).id
        },
        {
          alternative: options.getUser('user', true).id,
          user: options.getUser('alias', true).id
        }
      ]
    }
  });
  if (alias !== null) {
    interaction.editReply({
      content: 'The alias you attempted to set already exists'
    });
    return Promise.resolve();
  }
  // Check for inverse aliases
  const inverse = await client.models?.Alias.findOne({
    where: {
      user: options.getUser('alias', true).id,
      alternative: options.getUser('user', true).id
    }
  });
  if (inverse !== null) {
    interaction.editReply({
      content: 'The alias you attempted to set already exists'
    });
    return Promise.resolve();
  }
  // Create the alias
  const attr: AliasCreationAttributes = {
    user: options.getUser('user', true).id,
    alternative: options.getUser('alias', true).id,
    moderator: interaction.user.id
  };
  await client.models?.Alias.create(attr).then(
    (dbAlias: Alias) => {
      if (!dbAlias) {
        interaction.editReply({
          content: 'Failed to create the association in the database. Please try again later'
        });
        return Promise.resolve();
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
        return Promise.resolve();
      }
      interaction.editReply({ content: 'An unexpected error occurred while creating the alias. Please try again later' });
    }
  );
}
