import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { CmdFileArgs } from '../typings/Extensions.js';

export const ephemeral = true;
export const data = new SlashCommandBuilder()
  .setName('unban')
  .setDescription('Unbans a user')
  .addUserOption((option) => option.setName('user').setDescription('Banned user').setRequired(true))
  // Only allow users with BanMembers permission to use this command
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);
export async function execute({ client, interaction, options }: CmdFileArgs): Promise<void> {
  // Find ban
  const b = await interaction.guild.bans.fetch(options.getUser('user'));
  if (!b) {
    interaction.editReply({ content: 'The supplied user is not banned' });
    return;
  }
  // Unban on Discord's side
  await interaction.guild.bans.remove(b.user);
  // Remove from database
  await client.models.ban.destroy({
    where: {
      targetId: b.user.id,
      guildId: interaction.guild.id
    }
  });
  // Reply
  interaction.editReply({ content: `Unbanned ${b.user.toString()}` });
}
