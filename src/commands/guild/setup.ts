import { CommandInteraction, CommandInteractionOptionResolver } from 'discord.js';
import { CustomClient } from '../../typings/Extensions.ts';
import { GuildCreationAttributes } from '../../typings/Models.ts';

export const name = 'setup';
export async function run(
  client: CustomClient,
  interaction: CommandInteraction,
  options: CommandInteractionOptionResolver
): Promise<void> {
  const attr: GuildCreationAttributes = {
    guildId: interaction.guild?.id as string,
    settings: {
      channel: options.getChannel('staff_channel', true).id,
      role: options.getRole('authorised_role', true).id
    }
  };

  const dbResponse = await client.models?.Guild.findOrCreate({
    where: {
      guildId: attr.guildId
    },
    defaults: attr
  });
  if (!dbResponse) {
    interaction.editReply({
      content: 'An error occurred while performing setup. Please try again later'
    });
    return Promise.resolve();
  }
  interaction.editReply({
    content: `Success! ${dbResponse[1] ? 'Created' : 'Updated'} guild settings for ${dbResponse[0].guildId}`
  });
  return Promise.resolve();
}
