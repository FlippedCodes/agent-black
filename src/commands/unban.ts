import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from '../typings/Extensions.js';

export const name = 'unban';
export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('Unbans a user')
  .addUserOption((option) => option.setName('user').setDescription('Banned user').setRequired(true));
export async function run(
  _client: CustomClient,
  interaction: ChatInputCommandInteraction,
  interaction2: LockInfo,
  options: ChatInputCommandInteraction['options']
): Promise<void> {
  if (!interaction.memberPermissions.has('BanMembers')) {
    interaction.editReply({ content: 'You are not authorised to use this command' });
    return;
  }
  // Find ban
  const b = await interaction.guild.bans.fetch(options.getUser('user'));
  if (!b) {
    interaction.editReply({ content: 'The supplied user is not banned' });
    return;
  }
  // Unban
  await interaction.guild.bans.remove(b.user);
  // Reply
  interaction.editReply({ content: `Unbanned ${b.user.toString()}` });
}
