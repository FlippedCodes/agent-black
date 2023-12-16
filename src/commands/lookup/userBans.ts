import { EmbedBuilder } from 'discord.js';
import { CustomClient } from '../../typings/Extensions.js';

function escape(str: string): string {
  return str.replace(/`/g, '\\`');
}

export const name = 'userBans';
export async function run(client: CustomClient, user: string): Promise<EmbedBuilder[]> {
  const bans = await client.models.ban.findAll({ where: { targetId: user } });
  const u = await client.users.fetch(user);
  const e: EmbedBuilder[] = [];
  if (!bans || bans.length === 0)
    return [new EmbedBuilder().setTitle('No Bans Found').setDescription(`No bans were found for <@${user}> (${user})`)];
  for (const ban of bans) {
    const g = await client.guilds.fetch(ban.guildId);
    e.push(
      new EmbedBuilder()
        .setTitle(`${u.username}'s Bans`)
        .setDescription(
          `This ban is: **${!ban.isSoftDeleted() ? 'Active' : 'Removed'}**\`\`\`\n${escape(ban.reason)}\`\`\``
        )
        .setFields(
          {
            name: 'Target',
            value: `<@${ban.targetId}>`,
            inline: true
          },
          {
            name: 'Server',
            value: `${g.name} (${g.id})`,
            inline: true
          },
          {
            name: 'Timings',
            value: `Created: <t:${Math.floor(ban.createdAt.getTime() / 1000)}:F>\nUpdated: <t:${Math.floor(
              ban.updatedAt.getTime() / 1000
            )}:F>`,
            inline: true
          }
        )
        .setFooter({
          text: `${bans.indexOf(ban) + 1}/${bans.length}`
        })
        .setTimestamp()
    );
  }
  return e;
}
