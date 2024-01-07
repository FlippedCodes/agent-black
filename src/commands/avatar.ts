import { SlashCommandBuilder } from 'discord.js';
import { CmdFileArgs } from '../typings/Extensions.js';

export const ephemeral = true;
export const data = new SlashCommandBuilder()
  .setName('avatar')
  .setDescription("Fetches a user's profile picture")
  .addUserOption((option) => {
    return option.setName('user').setDescription('User to fetch').setRequired(true);
  });
export async function execute({ interaction, options }: CmdFileArgs): Promise<void> {
  interaction.editReply({
    embeds: [
      {
        description: `Avatar for ${options.getUser('user', true).toString()}`,
        image: {
          url:
            options.getUser('user', true).displayAvatarURL({ size: 4096 }) ||
            'https://cdn.discordapp.com/embed/avatars/5.png'
        }
      }
    ]
  });
}
