import { EmbedBuilder } from 'discord.js';
import { CustomClient } from '../../typings/Extensions.js';

function escape(str: string): string {
  return str.replace(/`/g, '\\`');
}

export const name = 'userWarns';
export async function run(client: CustomClient, user: string): Promise<EmbedBuilder[]> {
  const warns = await client.models.warn.findAll({ where: { targetId: user } });
  const u = await client.users.fetch(user);
  if (!u) return [];
  const e: EmbedBuilder[] = [];
  if (!warns || warns.length === 0)
    return [
      new EmbedBuilder().setTitle('No Warns Found').setDescription(`No warns were found for <@${user}> (${user})`)
    ];
  for (const warn of warns) {
    const g = await client.guilds.fetch(warn.guildId);
    e.push(
      new EmbedBuilder()
        .setTitle(`${u.username}'s Warnings`)
        .setDescription(
          `This warn is: **${!warn.isSoftDeleted() ? 'Active' : 'Removed'}**\`\`\`\n${escape(warn.reason)}\`\`\``
        )
        .setFields(
          {
            name: 'Target',
            value: `<@${warn.targetId}>`,
            inline: true
          },
          {
            name: 'Server',
            value: `${g.name} (${g.id})`,
            inline: true
          },
          {
            name: 'Timings',
            value: `Created: <t:${Math.floor(warn.createdAt.getTime() / 1000)}:F>\nUpdated: <t:${Math.floor(
              warn.updatedAt.getTime() / 1000
            )}:F>`,
            inline: true
          }
        )
        .setFooter({
          text: `${warns.indexOf(warn) + 1}/${warns.length}`
        })
        .setTimestamp()
    );
  }
  return e;
}
