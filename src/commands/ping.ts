import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from '../typings/Extensions.js';

export const name = 'ping';
export const data = new SlashCommandBuilder().setName(name).setDescription('Shows Discord API and bot latency');
export async function run(
  client: CustomClient,
  interaction: ChatInputCommandInteraction,
  _options: ChatInputCommandInteraction['options']
): Promise<void> {
  const t0 = Date.now();
  await interaction.editReply({ content: 'Pinging services, please wait (0/1)' });
  // -- //
  await interaction.editReply({ content: 'Pinging services, please wait (1/1)' });
  const t1 = Date.now();
  const latency = t1 - t0;
  // -- //
  interaction.editReply({
    content: 'Pinged services!',
    embeds: [
      {
        title: 'Latency Results',
        description: `Discord API: ${latency}ms\nWebsocket: ${client.ws.ping}ms`
      }
    ]
  });
}
