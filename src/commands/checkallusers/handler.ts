import { CustomClient } from '../../typings/Extensions.ts';
import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { Ban } from '../../typings/Models.ts';

export function handler(client: CustomClient, interaction: CommandInteraction, bans: Ban[]): Promise<void> {
  // Split the bans into groups of 5
  const banGroups: EmbedBuilder[][] = [];
  let temp: EmbedBuilder[] = [];
  bans.forEach(async (ban, index) => {
    // Fetch guild if not cached
    const g = client.guilds.cache.get(ban.guildId) || (await client.guilds.fetch(ban.guildId));
    // Create embed to push to array
    const embed = new EmbedBuilder().setDescription(`Guild: ${g.name} (${ban.guildId})
      User: <@${ban.targetId}> (${ban.targetId})
      Reason:
      \`\`\`\n${ban.reason}\`\`\``);
    // If array is full, push to banGroups
    if (index % 5 === 0 && index !== 0) {
      banGroups.push(temp);
      temp = [];
    }
    // Push embed to temp array
    temp.push(embed);
  });
  // Push remaining embeds to banGroups
  if (temp.length > 0) {
    banGroups.push(temp);
  }
  // Every 10 seconds, send 5 embeds
  const i = setInterval(() => {
    interaction.followUp({ embeds: banGroups.shift() });
    // If there are no more embeds to send, clear the interval
    if (banGroups.length === 0) {
      clearInterval(i);
      // Inform the user of completion
      interaction.editReply({
        content: `Success! Scanned all members and found ${bans.length} bans. See below for details`
      });
    }
  }, 10_000);
  return Promise.resolve();
}
