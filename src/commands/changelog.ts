import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from '../typings/Extensions.ts';
import { commands } from '../configs/config.json' assert { type: 'json' };
import { readFileSync } from 'node:fs';

export const name = 'changelog';
export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('Displays current version and changes as of the most recent update');
export async function run(_client: CustomClient, interaction: CommandInteraction): Promise<void> {
  await interaction.deferReply({ ephemeral: true });
  interaction.editReply({
    embeds: [new EmbedBuilder().setDescription(readFileSync(commands.changelog).toString())]
  });
  return Promise.resolve();
}
