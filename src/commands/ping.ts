import { SlashCommandBuilder } from 'discord.js';
import { CmdFileArgs } from '../typings/Extensions.js';

export const ephemeral = true;
export const data = new SlashCommandBuilder().setName('ping').setDescription('Shows Discord API and bot latency');
export async function execute({ client, interaction }: CmdFileArgs): Promise<void> {
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
