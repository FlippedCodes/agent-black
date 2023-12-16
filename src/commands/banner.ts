import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from '../typings/Extensions.js';

export const name = 'banner';
export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription("Fetches a user's banner")
  .addUserOption((option) => {
    return option.setName('user').setDescription('User to fetch').setRequired(true);
  });
export async function run(
  _client: CustomClient,
  interaction: ChatInputCommandInteraction,
  options: ChatInputCommandInteraction['options']
): Promise<void> {
  await options.getUser('user').fetch();
  interaction.editReply({
    embeds: [
      {
        description: `Banner for ${options.getUser('user', true).toString()}`,
        image: {
          url:
            options.getUser('user', true).bannerURL({ size: 2048 }) || 'https://cdn.discordapp.com/embed/avatars/5.png'
        }
      }
    ]
  });
}
