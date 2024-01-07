import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { readFileSync } from 'node:fs';
import { default as config } from '../configs/config.json' assert { type: 'json' };
import { CmdFileArgs } from '../typings/Extensions.js';
const { commands } = config;

export const ephemeral = true;
export const data = new SlashCommandBuilder()
  .setName('changelog')
  .setDescription('Displays current version and changes as of the most recent update');
export async function execute({ interaction }: CmdFileArgs): Promise<void> {
  interaction.editReply({
    embeds: [new EmbedBuilder().setDescription(readFileSync(commands.changelog).toString())]
  });
  return;
}
