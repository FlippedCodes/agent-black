import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BanManager } from '../classes/banManager.js';
import { CustomClient } from '../typings/Extensions.js';

function authorised(client: CustomClient, user: string): Promise<boolean> {
  return client.models.user
    .findOne({ where: { userId: user } })
    .then((u) => u.flags.has('Maintainer'))
    .catch(() => false);
}

export const name = 'syncbans';
export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('Adds bans from the current guild [MAINTAINER ONLY]');
export async function run(
  client: CustomClient,
  interaction: ChatInputCommandInteraction,
  _options: ChatInputCommandInteraction['options']
): Promise<void> {
  // Check owner
  if (!authorised(client, interaction.user.id)) {
    interaction.editReply({ content: 'You are not authorised to use this command' });
    return;
  }
  // Fetch guild
  const g = await client.models.guild.findOne({ where: { guildId: interaction.guildId } });
  if (!g) {
    interaction.editReply({ content: 'This server is not participating! Run `/guild setup` to add the server' });
    return;
  }
  const manager = new BanManager({ bans: [], sequelize: client.sequelize });
  // Loop through guild
  await manager.addGuild(interaction.guild, true);
  // Sync bans
  const bans = await manager.sync();
  const success = bans.filter((b) => b.status !== 'rejected');
  // Reply
  interaction.editReply({ content: `Synced ${success.length}/${bans.length} bans` });
}
