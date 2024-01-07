import { SlashCommandBuilder } from 'discord.js';
import { CmdFileArgs } from '../typings/Extensions.js';

export const ephemeral = true;
export const data = new SlashCommandBuilder()
  .setName('banner')
  .setDescription("Fetches a user's banner")
  .addUserOption((option) => {
    return option.setName('user').setDescription('User to fetch').setRequired(true);
  });
export async function execute({ interaction, options }: CmdFileArgs): Promise<void> {
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
