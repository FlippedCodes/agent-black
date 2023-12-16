import { EmbedBuilder, Guild } from 'discord.js';
import { CustomClient, MessageType } from '../../typings/Extensions.js';

export const name = 'masterMessage';
export async function execute(
  client: CustomClient<true>,
  type: MessageType,
  msg: string,
  targetUser?: string
): Promise<void> {
  const embed = new EmbedBuilder().setDescription(msg).setColor(type);
  switch (type) {
    case MessageType.Broadcast:
      embed.setTitle('Maintainer Broadcast');
      break;
    case MessageType.UserBanned:
      embed.setTitle('User in This Server Banned');
      break;
    case MessageType.UserWarned:
      embed.setTitle('User in This Server Warned');
      break;
    case MessageType.Maintenance:
      embed.setTitle('Maintenance Notice');
      break;
    case MessageType.SecurityAlert:
      embed.setTitle('** Security Alert **');
      break;
    case MessageType.Other:
      embed.setTitle('General Notice');
      break;
  }
  const servers: Guild[] = [];
  if (type === MessageType.UserBanned || type === MessageType.UserWarned) {
    // Find affected guilds
    client.guilds.cache.each((g) =>
      g.members
        .fetch(targetUser)
        .then(() => servers.push(g))
        .catch(() => undefined)
    );
  } else {
    // Send to all servers
    client.guilds.cache.each((g) => servers.push(g));
  }
  // Check guilds for active status and send to participating ones
  servers.forEach(async (g) => {
    const s = await client.models.guild.findOne({ where: { guildId: g.id } });
    if (!s || !s.enabled) return; // The server's not participating or inactive
    // Send message
    const c = await g.channels.fetch(s.settings.channel);
    if (!c || !c.isTextBased()) return; // Channel not found
    c.send({ embeds: [embed] });
  });
}
