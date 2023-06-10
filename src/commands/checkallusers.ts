import { SlashCommandBuilder, CommandInteraction, PermissionsBitField, PermissionFlagsBits } from 'discord.js';
import { CustomClient } from '../typings/Extensions.ts';

export const name = 'checkallusers';
export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('Checks all users in the current server')
  .addStringOption((option) => {
    return option
      .setName('spam_warning')
      .setDescription('I am aware that this bot may spam the channel and this cannot be stopped midway through')
      .addChoices({
        name: 'I have read the above',
        value: 'yes'
      });
  });
export async function run(client: CustomClient, interaction: CommandInteraction): Promise<void> {
  await interaction.deferReply({ ephemeral: true });
  if ((interaction.member?.permissions as PermissionsBitField).has(PermissionFlagsBits.ManageGuild)) {
    interaction.editReply({
      content: 'You are not authorized to use this command'
    });
    return Promise.resolve();
  }

  const users = await interaction.guild?.members.fetch();
  if (!users) {
    interaction.editReply({ content: 'Could not fetch users' });
    return Promise.resolve();
  }
  const ids = users.map((user) => user.id);
  const allBans = await client.models?.Ban.findAll({
    where: { targetId: ids }
  });
  if (!allBans || allBans.length === 0) {
    interaction.editReply({
      content: `Success! Scanned all members and found no bans. Your server is clean`
    });
    return Promise.resolve();
  }
  if (allBans.length <= 5) {
    allBans.forEach(async (ban) => {
      const g = client.guilds.cache.get(ban.guildId) || (await client.guilds.fetch(ban.guildId));
      interaction.followUp({
        embeds: [
          {
            description: `Guild: ${g.name} (${ban.guildId})
          User: <@${ban.targetId}> (${ban.targetId})
          Reason:
          \`\`\`\n${ban.reason}\`\`\``
          }
        ]
      });
    });
    interaction.editReply({
      content: `Success! Scanned all members and found ${allBans.length} bans. See below for details`
    });
    return Promise.resolve();
  }
  // @ts-expect-error This function has different parameters
  await client.commands?.get('checkallusers_handler')?.run(client, interaction, allBans);
  return Promise.resolve();
}
