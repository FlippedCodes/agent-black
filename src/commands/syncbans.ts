import { SlashCommandBuilder } from 'discord.js';
import { BanManager } from '../classes/banManager.js';
import { CmdFileArgs, CustomClient } from '../typings/Extensions.js';

async function authorised(client: CustomClient, user: string): Promise<boolean> {
  try {
    const u = await client.models.user.findOne({ where: { userId: user } });
    return u.flags.has('Maintainer');
  } catch {
    return false;
  }
}

export const ephemeral = true;
export const data = new SlashCommandBuilder()
  .setName('syncbans')
  .setDescription('Adds bans from the current guild [MAINTAINER ONLY]');
export async function execute({ client, interaction }: CmdFileArgs): Promise<void> {
  // Check owner
  if (!(await authorised(client, interaction.user.id))) {
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
