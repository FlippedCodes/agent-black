import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { readFileSync } from 'node:fs';
import { default as config } from '../configs/config.json' assert { type: 'json' };
import { CustomClient } from '../typings/Extensions.js';
const { commands } = config;

export const name = 'log';
export const data = new SlashCommandBuilder().setName(name).setDescription('Displays some information about the bot');
export async function run(_client: CustomClient, interaction: ChatInputCommandInteraction): Promise<void> {
  interaction.editReply({
    embeds: [new EmbedBuilder().setDescription(readFileSync(commands.about).toString())]
  });
  return;
}
