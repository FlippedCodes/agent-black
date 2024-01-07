import { ChannelType, Collection, EmbedBuilder, Guild, Webhook } from 'discord.js';
import { readFileSync } from 'node:fs';
import { BroadcastType, CustomClient } from '../../typings/Extensions.js';

export const name = 'masterMessage';
export async function execute(
  client: CustomClient<true>,
  type: BroadcastType,
  msg: string,
  targetUser?: string
): Promise<void> {
  const embed = new EmbedBuilder().setDescription(msg).setColor(type);
  switch (type) {
    case BroadcastType.Broadcast:
      embed.setTitle('Maintainer Broadcast');
      break;
    case BroadcastType.UserBanned:
      embed.setTitle('User in This Server Banned');
      break;
    case BroadcastType.UserWarned:
      embed.setTitle('User in This Server Warned');
      break;
    case BroadcastType.Maintenance:
      embed.setTitle('Maintenance Notice');
      break;
    case BroadcastType.SecurityAlert:
      embed.setTitle('** Security Alert **');
      break;
    case BroadcastType.Other:
      embed.setTitle('General Notice');
      break;
  }
  const servers: Guild[] = [];
  if (type === BroadcastType.UserBanned || type === BroadcastType.UserWarned) {
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
  servers.forEach(async (g) => {
    // Check guilds for active status and send to participating ones
    const s = await client.models.guild.findOne({
      where: { guildId: g.id },
      include: [{ model: client.models.guildsettings, as: 'setting' }]
    });
    if (!s || !s.enabled) return; // The server's not participating or inactive
    // Find channel and grab webhooks
    const c = await client.channels.fetch(s.setting.logChannel);
    if (!c || c.type !== ChannelType.GuildText) return; // Invalid channel
    const webhooks = await c
      .fetchWebhooks()
      .then((w) => w.filter((w) => w.applicationId === client.application.id))
      .catch(() => new Collection());
    // Use the first webhook or create one
    const hook =
      webhooks.size > 1
        ? (webhooks.first() as Webhook | Record<string, never>)
        : await c.createWebhook({ name: 'Agent Black', avatar: readFileSync('../assets/agentBlack.jpg') });
    // Send message
    hook.send({ embeds: [embed] });
  });
}
