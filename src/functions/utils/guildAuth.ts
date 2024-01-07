import { GuildMember } from 'discord.js';
import { CustomClient } from '../../typings/Extensions.js';

export const name = 'guildAuth';
export async function execute(client: CustomClient, member: GuildMember): Promise<boolean> {
  // Find DB entry
  const dbGuild = await client.models.guild.findOne({
    where: { guildId: member.guild.id }
  });
  if (!dbGuild) return false;
  // Get settings
  const settings = await dbGuild.getSetting();
  if (!settings) return false;
  // Return whether they have the role or not
  return member.roles.cache.has(settings.staffRole);
}
