import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { CustomClient, FlagEmoji } from '../typings/Extensions.js';
// Load functions from other files
import { run as aliasOverview } from './lookup/aliasOverview.js';
import { run as userBans } from './lookup/userBans.js';
import { run as userWarns } from './lookup/userWarns.js';

export const name = 'lookup';
export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('Fetches data from the Discord API and Agent Black database')
  .addUserOption((option) => {
    return option.setName('user').setDescription('The user to search').setRequired(true);
  });
export async function run(
  client: CustomClient,
  interaction: ChatInputCommandInteraction,
  options: ChatInputCommandInteraction['options']
): Promise<void> {
  // Definitions
  const user = options.getUser('user', true),
    aliases = (await client.models.alias.findAll({ where: { user: user.id } })) || [];
  // Get their user information
  const discordUser = options.getUser('user', true);
  const dFlags = await discordUser.fetchFlags();
  const flags: string[] = dFlags
    .toArray()
    // Map to emojis
    .map((flag) => FlagEmoji[String(flag) as keyof typeof FlagEmoji])
    .filter((v) => v !== undefined);

  // Unverified Bot
  if (discordUser.bot && !flags.includes(FlagEmoji.VerifiedBot)) flags.push('**Unverified Bot**');

  /** @desc List of categories that can be switched through */
  const categories: { [key: string]: EmbedBuilder[] } = {
    overview: [],
    aliases: [],
    warns: [],
    bans: []
  };
  //#region Overview
  categories.overview.push(
    new EmbedBuilder()
      .setTitle(`User Information`)
      .setDescription('Contains basic information about this user')
      .addFields(
        {
          name: 'Username',
          value: discordUser.username,
          inline: true
        },
        {
          name: 'Display Name',
          value: String(discordUser.globalName || 'N/A'),
          inline: true
        },
        {
          name: 'ID',
          value: String(discordUser.id),
          inline: true
        },
        {
          name: 'Created At',
          value: `<t:${Math.floor(discordUser.createdAt.getTime() / 1000)}:F>`,
          inline: true
        },
        {
          name: 'Flags',
          value: flags.join(' ') || 'None',
          inline: true
        }
      )
      .setTimestamp()
  );
  //#endregion
  //#region Warns & Bans
  categories['warns'] = await userWarns(client, user.id);
  categories['bans'] = await userBans(client, user.id);
  categories['aliases'] = await aliasOverview(client, user.id);
  // Use an array to store promises
  const aliasBans: Promise<EmbedBuilder[]>[] = [];
  const aliasWarns: Promise<EmbedBuilder[]>[] = [];
  for (const alias of aliases) {
    aliasBans.push(userBans(client, String(alias.alternative)));
    aliasWarns.push(userWarns(client, String(alias.alternative)));
  }
  // Wait for all promises to resolve
  // Flatten to return a single array
  categories['bans'].push(...(await Promise.all(aliasBans)).flat());
  categories['warns'].push(...(await Promise.all(aliasWarns)).flat());
  //#endregion
  await client.functions.get('utils_pagination').execute(client, interaction, categories, [
    {
      label: 'Overview',
      value: 'overview',
      description: `View general information on ${user.username}`
    },
    {
      label: 'Alias',
      value: 'aliases',
      description: `View aliases for ${user.username}`
    },
    {
      label: 'Bans',
      value: 'bans',
      description: `${user.username}'s bans across all servers`
    },
    {
      label: 'Warns',
      value: 'warns',
      description: `${user.username}'s warnings across all servers`
    }
  ]);
}
