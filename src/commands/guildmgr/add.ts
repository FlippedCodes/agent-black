import { CommandInteraction, CommandInteractionOptionResolver } from 'discord.js';
import { CustomClient } from '../../typings/Extensions.ts';

export const name = 'add';
export async function run(
  client: CustomClient,
  interaction: CommandInteraction,
  options: CommandInteractionOptionResolver
): Promise<void> {
  const rawChannel = options.getString('channel', true);
  const rawGuild = options.getString('server', true);
  const rawRole = options.getString('role', true);
  const guild = await client.guilds.fetch(rawGuild);
  if (!guild) {
    await interaction.editReply('Invalid argument: Guild not found');
    return;
  }
  const channel = guild.channels.cache.get(rawChannel);
  if (!channel) {
    await interaction.editReply('Invalid argument: Channel not found');
    return;
  }
  const role = guild.roles.cache.get(rawRole);
  if (!role) {
    await interaction.editReply('Invalid argument: Role not found');
    return;
  }
  if(!client.models) return; // Suppress ESLint unsafe optional chaining
  const [_dbGuild, created] = await client.models.Guild.findOrCreate({
    where: {
      guildId: guild.id
    },
    defaults: {
      guildId: guild.id,
      banned: 0,
      enabled: 1,
      settings: {
        channel: channel.id,
        role: role.id
      }
    }
  });
  interaction.editReply(`Guild ${guild.name} has been ${created ? 'added' : 'updated'} with the settings provided`);
  return Promise.resolve();
}
