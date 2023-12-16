import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SelectMenuComponentOptionData,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction
} from 'discord.js';
import { CustomClient } from '../../typings/Extensions.js';

export const name = 'pagination';
export async function execute(
  _client: CustomClient,
  interaction: ChatInputCommandInteraction,
  categories: { [key: string]: EmbedBuilder[] },
  options: SelectMenuComponentOptionData[]
): Promise<void> {
  /** @desc Current category's embeds */
  let embeds: EmbedBuilder[] = [];
  /** @desc Current page index */
  let page = 0;
  options.push({
    label: 'Cancel',
    value: 'cancel',
    description: 'Cancel the command',
    emoji: '❌'
  });
  const selectorRow: ActionRowBuilder<StringSelectMenuBuilder> = new ActionRowBuilder({
    components: [
      new StringSelectMenuBuilder({
        customId: 'profile-category',
        placeholder: 'Select a category to review',
        options,
        min_values: 1,
        max_values: 1
      })
    ]
  });
  const paginationRow: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder({
    components: [
      new ButtonBuilder({ customId: 'previous', label: '◀️', style: ButtonStyle.Primary }),
      new ButtonBuilder({ customId: 'cancel', label: '🟥', style: ButtonStyle.Danger }),
      new ButtonBuilder({ customId: 'next', label: '▶️', style: ButtonStyle.Primary })
    ]
  });

  //#region Pagination
  const coll = await interaction
    .editReply({ embeds: [categories.overview[0]], components: [selectorRow] })
    .then((m) => m.createMessageComponentCollector({ filter: (i) => i.user.id === interaction.user.id, time: 180_000 }))
    .catch(() => null);

  if (!coll) {
    interaction.editReply({ content: 'Something went wrong. Please try again later.', components: [] });
    return;
  }
  coll.on('collect', (i: ButtonInteraction | StringSelectMenuInteraction) => {
    const selectors: ActionRowBuilder<StringSelectMenuBuilder | ButtonBuilder>[] = [selectorRow];
    // If they select the menu, switch category
    if (i.isStringSelectMenu()) {
      // If they cancel, stop the collector
      if (i.values[0] === 'cancel') return coll.stop();
      // Get the category
      embeds = categories[i.values[0]];
      // New category, so page #0
      page = 0;
      // If the length is greater than 2, add pagination row
      if (embeds.length > 1) selectors.unshift(paginationRow);
      // Update the message
      i.update({ embeds: [embeds[page]], components: selectors });
      return;
    }
    // Pagination row
    switch (i.customId) {
      // Cancel
      case 'cancel': {
        coll.stop();
        break;
      }
      // Previous
      case 'previous': {
        page = page - 1;
        // If the page is less than 0, set it to the last page
        if (page < 0) page = embeds.length - 1;
        // If the length is greater than the length, add pagination row
        if (embeds.length > 1) selectors.unshift(paginationRow);
        // Update the message
        i.update({ embeds: [embeds[page]], components: selectors });
        break;
      }
      // Next
      case 'next': {
        page = page + 1;
        // If the page is greater than the length, set it to the first page
        if (page > embeds.length - 1) page = 0;
        // If the length is greater than 2, add pagination row
        if (embeds.length > 1) selectors.unshift(paginationRow);
        // Update the message
        i.update({ embeds: [embeds[page]], components: selectors });
        break;
      }
      // Theoretically impossible to reach
      default: {
        i.update({
          content: "You shouldn't be seeing this! Report this to an Engineer\n\n**CUSTOMID**: " + i.customId,
          embeds: [],
          components: []
        });
      }
    }
  });
  coll.on('end', () => {
    interaction
      .fetchReply()
      .then((m) =>
        m.edit({
          content: `This embed has timed out. Please run the command again: </${interaction.commandName}:${interaction.commandId}>`,
          components: []
        })
      )
      .catch(() => null);
  });
  //#endregion
}
