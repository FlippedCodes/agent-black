import { EmbedBuilder } from 'discord.js';
import { CustomClient } from '../../typings/Extensions.js';

export const name = 'aliasOverview';
export async function execute(client: CustomClient, target: string): Promise<EmbedBuilder[]> {
  // Variables
  const aliases = await client.models.alias.findAll({ where: { user: target } });
  // No aliases
  if (!aliases || aliases.length === 0) {
    return [
      new EmbedBuilder()
        .setTitle('Aliases')
        .setDescription(`No aliases exist for the selected user <@${target}> (${target})`)
    ];
  }
  // Add aliases, 6 per embed
  const embeds: EmbedBuilder[] = [];
  let embed = new EmbedBuilder().setTitle('Aliases').setDescription(`Aliases for <@${target}> (${target})`);
  for (let i = 0; i < aliases.length; i++) {
    // Add field
    embed.addFields({
      name: `Alias ${aliases[i].aliasId}`,
      value: `<@${aliases[i].alternative}> (${aliases[i].alternative})`,
      inline: true
    });
    // Add embed to array if 6 fields have been added
    if ((i % 6 === 0 && i !== 0) || i === aliases.length - 1) {
      embed.setFooter({ text: `Page ${embeds.length + 1}` });
      embeds.push(embed);
      embed = new EmbedBuilder().setTitle('Aliases').setDescription(`Aliases for <@${target}> (${target})`);
    }
  }
  return embeds;
}
