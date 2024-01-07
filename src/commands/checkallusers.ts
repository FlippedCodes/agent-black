import { SlashCommandBuilder } from 'discord.js';
import { CmdFileArgs } from '../typings/Extensions.js';

export const ephemeral = true;
export const data = new SlashCommandBuilder()
  .setName('checkallusers')
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
export async function execute({ client, interaction }: CmdFileArgs): Promise<void> {
  // Check if they have the role
  if (!(await client.functions.get('utils_guildAuth').execute(client, interaction.member))) {
    interaction.editReply({
      content: 'You are not authorized to use this command'
    });
    return;
  }

  const users = await interaction.guild.members.fetch();
  if (!users) {
    interaction.editReply({ content: 'Could not fetch users' });
    return;
  }
  const ids = users.map((user) => user.id);
  // Get their aliases, if any exist
  await client.models.alias
    .findAll({
      where: { user: ids }
    })
    // Map to alternative
    .then((aliases) => aliases.map((a) => a.alternative))
    // Push to the list
    .then((aliases) => aliases.forEach((a) => ids.push(a)))
    // Catch and log the errors for later inspection
    .catch((err) => client.logs.error({ err }));
  // Find all bans relevant to the server
  const allBans = await client.models.ban.findAll({
    where: { targetId: ids }
  });
  // We didn't find anyone banned
  if (!allBans || allBans.length === 0) {
    interaction.editReply({
      content: `Success! Scanned all members and found no bans. Your server is clean`
    });
    return;
  }
  // If less than 5, emit embeds
  if (allBans.length <= 5) {
    allBans.forEach(async (ban) => {
      const g = await client.guilds.fetch(ban.guildId);
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
    return;
  }
  // If there's more than 5, send to the handler
  // @ts-expect-error This function has different parameters
  await client.commands.get('checkallusers_handler').execute(client, interaction, allBans);
  return;
}
