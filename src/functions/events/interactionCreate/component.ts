import { Message, MessageComponentInteraction } from 'discord.js';
import { CustomClient } from '../../../typings/Extensions.js';

function messageEqual(m1: Message, m2: Message) {
  return m1.content === m2.content && m1.embeds === m2.embeds && m1.components === m2.components;
}

export const name = 'component';
export async function execute(_client: CustomClient<true>, interaction: MessageComponentInteraction) {
  // Store the state of message and compare it 1s later
  const m = Object.assign({}, interaction.message);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  if (!messageEqual(m, interaction.message)) return;
  // Remove components and mark expired
  interaction.message.edit({
    components: [],
    content: `This embed has timed out. Please run the command again`
  });
}
