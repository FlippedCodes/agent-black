import { Interaction, InteractionType } from 'discord.js';
import { CustomClient } from '../../../typings/Extensions.js';

export const name = 'main';
export async function execute(client: CustomClient<true>, interaction: Interaction): Promise<void> {
  // Avoid running commands before the bot is ready
  if (!client.ready && interaction.isCommand()) {
    interaction.reply({
      content: 'The bot is still starting up. Please wait a few seconds and try again.',
      ephemeral: true
    });
  } else if (!client.ready) {
    return;
  }
  // Get the interaction function
  let func: string;
  switch (interaction.type) {
    case InteractionType.ApplicationCommand: {
      func = 'command';
      break;
    }
    case InteractionType.MessageComponent: {
      func = 'component';
      break;
    }
    case InteractionType.ApplicationCommandAutocomplete: {
      func = 'autocomplete';
      break;
    }
  }
  // Run all interaction functions
  client.functions.get(`events_interactionCreate_${func}`).execute(client, interaction);
  return;
}
