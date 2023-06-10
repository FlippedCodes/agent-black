import { CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from '../typings/Extensions.ts';

export const name = 'avatar';
export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription("Fetches a user's profile picture")
  .addUserOption((option) => {
    return option.setName('user').setDescription('User to fetch').setRequired(true);
  });
export async function run(
  _client: CustomClient,
  interaction: CommandInteraction,
  options: CommandInteractionOptionResolver
): Promise<void> {
  await interaction.deferReply({ ephemeral: false });
  interaction.editReply({
    embeds: [
      new EmbedBuilder().setImage(
        options.getUser('user')?.displayAvatarURL({ size: 4096 }) || 'https://cdn.discordapp.com/embed/avatars/5.png'
      )
    ]
  });
}
