import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { CustomClient } from '../../typings/Extensions.js';

export const name = 'stats';
export async function run(client: CustomClient, interaction: ChatInputCommandInteraction): Promise<void> {
  const guild = await client.models.guild.findOne({
    where: { guildId: interaction.guildId as string }
  });
  const owner = await interaction.guild.fetchOwner();
  if (!owner) {
    interaction.editReply({
      content: 'An error occurred while fetching guild data. Please try again later'
    });
    return;
  }
  const embed = new EmbedBuilder()
    .setTitle(`Statistics for ${interaction.guild.name}`)
    .setAuthor({
      name: owner.user.tag,
      iconURL: owner.displayAvatarURL({ size: 1024 })
    })
    .addFields([
      {
        name: 'Server Info',
        value: `${interaction.guild.name} (\`${interaction.guildId}\`)`,
        inline: true
      }
    ])
    .setTimestamp();
  if (guild) {
    embed.addFields([
      {
        name: 'Logging Channel',
        value: `<#${guild.settings.channel}> (\`${guild.settings.channel}\`)`,
        inline: true
      },
      {
        name: 'Authorised Role',
        value: `<@&${guild.settings.role}> (\`${guild.settings.role}\`)`,
        inline: true
      },
      {
        name: 'Association Information',
        value: `Participating Since: \`${
          guild.enabled ? `${Math.floor(guild.updatedAt.getTime() / 1000)}` : 'N/A'
        }\`\nBans Submitted: \`${await guild.countBans()}\``
      }
    ]);
  }
  interaction.editReply({ embeds: [embed] });
  return;
}
