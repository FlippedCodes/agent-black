import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { CmdFileArgs } from '../typings/Extensions.js';

export const ephemeral = false;
export const data = new SlashCommandBuilder().setName('help').setDescription('Displays help menu');
export async function execute({ interaction }: CmdFileArgs): Promise<void> {
  const embed = new EmbedBuilder().setTitle('Help Panel').setDescription(
    `Our wiki is found here and details every command: https://github.com/FlippedCode/agent-black/wiki
      You can also join our server found here: https://discord.gg/TqBwHtzzhD`
  );
  interaction.editReply({ embeds: [embed] });
  return;
}
