import { ChatInputCommandInteraction } from 'discord.js';
import { CustomClient } from '../../typings/Extensions.js';
import { GuildCreationAttributes } from '../../typings/Models.js';

export const name = 'setup';
export async function run(
  client: CustomClient,
  interaction: ChatInputCommandInteraction,
  options: ChatInputCommandInteraction['options']
): Promise<void> {
  const attr: GuildCreationAttributes = {
    guildId: interaction.guild.id as string,
    settings: {
      channel: options.getChannel('staff_channel', true).id,
      role: options.getRole('authorised_role', true).id
    }
  };

  const dbResponse = await client.models.guild.findOrCreate({
    where: {
      guildId: attr.guildId
    },
    defaults: attr
  });
  if (!dbResponse) {
    interaction.editReply({
      content: 'An error occurred while performing setup. Please try again later'
    });
    return;
  }
  interaction.editReply({
    content: `Success! ${dbResponse[1] ? 'Created' : 'Updated'} guild settings for ${dbResponse[0].guildId}`
  });
  return;
}
