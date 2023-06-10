import { CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from '../typings/Extensions.ts';

export const name = 'lookup';
export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('Fetches data from the Discord API and Agent Black database')
  .addUserOption((option) => {
    return option.setName('user').setDescription('The user to lookup').setRequired(true);
  });
export async function run(
  client: CustomClient,
  interaction: CommandInteraction,
  options: CommandInteractionOptionResolver
): Promise<void> {
  const bans = {};
  const warns = {};
  const aliases = await client.models?.Alias.findAll({ where: { user: options.getUser('user', true).id } });
  const discordUser = await options.getUser('user', true);
  const flags = await discordUser.fetchFlags();
  const embed = new EmbedBuilder()
    .setTitle(`${discordUser.username} (${discordUser.displayName})`)
    .setDescription(`**ID:** ${discordUser.id}\n**Created At**`)
    .addFields(
      {
        name: 
      }
    )
}
