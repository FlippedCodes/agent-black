import { CommandInteraction, CommandInteractionOptionResolver } from 'discord.js';
import { CustomClient } from '../../typings/Extensions.ts';

export const name = 'block';
export async function run(
  client: CustomClient,
  interaction: CommandInteraction,
  options: CommandInteractionOptionResolver
): Promise<void> {
  const guildId = options.getString('server', true);
  const dbGuild = await client.models?.Guild.findOne({ where: { guildId } });
  if (!dbGuild) {
    interaction.editReply({ content: 'Specified guild ID is not in the database' });
    return Promise.resolve();
  }
  dbGuild.enabled = 0;
  await dbGuild.save();
  interaction.editReply({ content: `Guild \`${guildId}\` has been disabled from using the bot` });
  return Promise.resolve();
}
