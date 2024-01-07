import { CmdFileArgs } from '../../typings/Extensions.js';

export const name = 'disable';
export async function execute({ client, interaction }: CmdFileArgs): Promise<void> {
  const guild = await client.models.guild.findOne({
    where: { guildId: interaction.guildId as string }
  });
  if (!guild) {
    interaction.editReply({
      content: 'This server has not been set up yet. Please run `/guild setup`'
    });
    return;
  }
  if (guild.enabled) {
    interaction.editReply({ content: 'This server is already enabled' });
    return;
  }
  guild.enabled = true;
  await guild.save();
  interaction.editReply({
    content: 'Successfully enabled the bot in this server'
  });
  return;
}
