import { ChatInputCommandInteraction } from 'discord.js';
import { CustomClient } from '../../../typings/Extensions.js';

export const name = 'command';
export async function execute(client: CustomClient<true>, interaction: ChatInputCommandInteraction) {
  if (!interaction.isChatInputCommand()) return;
  // Use subcommand if it exists
  const sc = interaction.options.getSubcommand(false);
  const name = `${interaction.commandName.replace('d_', '')}${sc === null ? '' : `_${sc}`}`;
  // Get command
  const cmd = client.commands.get(name);
  if (!cmd) return;
  await interaction.deferReply({ ephemeral: cmd.ephemeral || false });
  // Check for ban
  const allowedCommands = ['about', 'ping'];
  const g = await client.models.guild.findOne({ where: { guildId: interaction.guildId } });
  if (!allowedCommands.includes(name) && g && g.banned === true) {
    interaction.editReply({
      embeds: [
        {
          color: 0xff0000,
          description: 'This server has been banned from using the bot'
        }
      ]
    });
    return;
  }
  // Run command
  try {
    cmd.run(client, interaction, interaction.options);
  } catch (err) {
    interaction.editReply({ content: 'Something went wrong while replying! This error has been logged' });
    client.logs.error({ msg: `E | ✘ ${name}`, err });
  }
}
