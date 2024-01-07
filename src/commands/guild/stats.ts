import { EmbedBuilder } from 'discord.js';
import { CmdFileArgs } from '../../typings/Extensions.js';

export const name = 'stats';
export async function execute({ client, interaction }: CmdFileArgs): Promise<void> {
  const guild = await client.models.guild.findOne({
    where: { guildId: interaction.guildId },
    include: [{ model: client.models.guildsettings, as: 'setting' }]
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
        value: `<#${guild.setting.logChannel}> (\`${guild.setting.logChannel}\`)`,
        inline: true
      },
      {
        name: 'Authorised Role',
        value: `<@&${guild.setting.staffRole}> (\`${guild.setting.staffRole}\`)`,
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
