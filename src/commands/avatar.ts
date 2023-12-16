import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from '../typings/Extensions.js';

export const name = 'avatar';
export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription("Fetches a user's profile picture")
  .addUserOption((option) => {
    return option.setName('user').setDescription('User to fetch').setRequired(true);
  });
export async function run(
  _client: CustomClient,
  interaction: ChatInputCommandInteraction,
  options: ChatInputCommandInteraction['options']
): Promise<void> {
  interaction.editReply({
    embeds: [
      {
        description: `Avatar for ${options.getUser('user', true).toString()}`,
        image: {
          url:
            options.getUser('user', true).displayAvatarURL({ size: 2048 }) ||
            'https://cdn.discordapp.com/embed/avatars/5.png'
        }
      }
    ]
  });
}
