import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { CustomClient } from '../typings/Extensions.ts';

export const name = 'help';
export const data = new SlashCommandBuilder().setName(name).setDescription('Displays help menu');
export async function run(_client: CustomClient, interaction: CommandInteraction): Promise<void> {
  await interaction.deferReply({ ephemeral: true });
  const embed = new EmbedBuilder().setTitle('Help Panel').setDescription(
    `Our wiki is found here and details every command: https://github.com/FlippedCode/agent-black/wiki
      You can also join our server found here: https://discord.gg/TqBwHtzzhD`
  );
  interaction.editReply({ embeds: [embed] });
  return Promise.resolve();
}
