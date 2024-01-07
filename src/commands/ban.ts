import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { CmdFileArgs } from '../typings/Extensions.js';

export const ephemeral = true;
export const data = new SlashCommandBuilder()
  .setName('ban')
  .setDescription('Permanently bans a user from the server')
  .addUserOption((option) => {
    return option.setName('user').setDescription('The user to ban').setRequired(true);
  })
  .addStringOption((option) => {
    return option.setName('reason').setDescription('Reason for ban, if any').setAutocomplete(true).setRequired(false);
  })
  .addNumberOption((option) => {
    return option.setName('delete_messages').setDescription('Time to delete messages').setChoices(
      {
        name: "Don't Delete Any",
        value: 0
      },
      {
        name: '1 Hour',
        value: 3600
      },
      {
        name: '6 Hours',
        value: 21600
      },
      {
        name: '12 Hours',
        value: 43200
      },
      {
        name: '24 Hours',
        value: 86400
      },
      {
        name: '3 Days',
        value: 259200
      },
      {
        name: '7 Days',
        value: 604800
      }
    );
  })
  // Only allow users with the Ban Members permission to use this command
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);
export async function execute({ client, interaction, options }: CmdFileArgs): Promise<void> {
  const target = options.getUser('user', true);
  // Check if we can ban
  if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
    interaction.editReply({ content: 'This bot needs the `Ban Members` permission' });
    return;
  }
  // Ban on Discord's side, removiung the ban if it exists
  const b = await interaction.guild.bans.fetch(target);
  if (b) await interaction.guild.bans.remove(target.id);
  await interaction.guild.bans.create(target, {
    reason: options.getString('reason') || undefined,
    deleteMessageSeconds: options.getNumber('deleteMessages') || undefined
  });
  // Find or create the ban in the database
  await client.models.ban.findOrCreate({
    where: {
      guildId: interaction.guild.id,
      targetId: target.id,
      reason: options.getString('reason') || null
    }
  });
}
