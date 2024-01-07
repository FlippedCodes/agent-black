import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from 'discord.js';
import { CustomClient } from '../../../typings/Extensions.js';

export const name = 'autocomplete';
export async function execute(client: CustomClient, interaction: AutocompleteInteraction) {
  const focus = interaction.options.getFocused(true);
  const lowerVal = focus.value.toLowerCase();
  const returnValue: ApplicationCommandOptionChoiceData[] = [];
  switch (focus.name) {
    case 'server': {
      client.guilds.cache
        .filter((g) => g.name.toLowerCase().includes(lowerVal))
        .forEach((g) => returnValue.push({ name: g.name, value: g.id }));
      break;
    }
    case 'role': {
      const g = interaction.options.getString('server');
      client.guilds.cache
        .get(g)
        .roles.cache.filter((r) => r.name.toLowerCase().includes(lowerVal))
        .forEach((r) => returnValue.push({ name: r.name, value: r.id }));
      break;
    }
    case 'channel': {
      const g = interaction.options.getString('server');
      client.guilds.cache
        .get(g)
        .channels.cache.filter((c) => c.name.toLowerCase().includes(lowerVal))
        .forEach((c) => returnValue.push({ name: c.name, value: c.id }));
      break;
    }
  }
  // Trim to 25
  if (returnValue.length > 25) returnValue.length = 25;
  await interaction.respond(returnValue);
}
