import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { readFileSync } from 'node:fs';
import { default as config } from '../configs/config.json' assert { type: 'json' };
import { CmdFileArgs } from '../typings/Extensions.js';
const { commands } = config;

export const ephemeral = false;
export const data = new SlashCommandBuilder()
  .setName('about')
  .setDescription('Displays some information about the bot');
export async function execute({ interaction }: CmdFileArgs): Promise<void> {
  interaction.editReply({
    embeds: [new EmbedBuilder().setDescription(readFileSync(commands.about).toString())]
  });
  return;
}
