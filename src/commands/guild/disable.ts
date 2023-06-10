import { CommandInteraction } from 'discord.js';
import { CustomClient } from '../../typings/Extensions.ts';

export const name = 'disable';
export async function run(client: CustomClient, interaction: CommandInteraction): Promise<void> {
  const guild = await client.models?.Guild.findOne({
    where: { guildId: interaction.guildId as string }
  });
  if (!guild) {
    interaction.editReply({
      content: 'This server has not been set up yet. Please run `/guild setup`'
    });
    return Promise.resolve();
  }
  if (!guild.enabled) {
    interaction.editReply({ content: 'This server is already disabled' });
    return Promise.resolve();
  }
  guild.enabled = 0;
  await guild.save();
  interaction.editReply({
    content: 'Successfully disabled the bot in this server'
  });
  return Promise.resolve();
}
