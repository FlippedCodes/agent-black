import { CmdFileArgs } from '../../typings/Extensions.js';

export const name = 'disable';
export async function execute({ client, interaction }: CmdFileArgs): Promise<void> {
  const guild = await client.models.guild.findOne({
    where: { guildId: interaction.guildId }
  });
  if (!guild) {
    interaction.editReply({
      content: 'This server has not been set up yet. Please run `/guild setup`'
    });
    return;
  }
  if (!guild.enabled) {
    interaction.editReply({ content: 'This server is already disabled' });
    return;
  }
  guild.enabled = false;
  await guild.save();
  interaction.editReply({
    content: 'Successfully disabled the bot in this server'
  });
  return;
}
