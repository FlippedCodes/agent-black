import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from '../typings/Extensions.js';

export const name = 'broadcast';
export const ephemeral = false;
export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('Broadcasts a message to all participating servers')
  .addStringOption((option) => {
    return option.setName('message').setDescription('Content to message to servers').setRequired(true);
  });
export async function run(
  client: CustomClient,
  interaction: ChatInputCommandInteraction,
  options: ChatInputCommandInteraction['options']
): Promise<void> {
  const dbUser = await client.models.user.findOne({
    where: { userId: interaction.user.id }
  });
  if (!dbUser) {
    await interaction.editReply({
      content: 'You are not authorized to use this command'
    });
    return;
  }
  const flags = dbUser.flags;
  if (!flags.has('Maintainer')) {
    await interaction.editReply({
      content: 'You are not authorized to use this command'
    });
    return;
  }
  // Convert body
  const body = options.getString('message', true).replace(/\\n/g, '\n');
  // Send message
  interaction.editReply({ content: 'Sending messages...' });
  const guilds = await client.models.guild.findAll({
    where: { enabled: true, banned: false }
  });
  const errors: { guildId: string; error: string }[] = [];
  guilds.forEach((g) => {
    client.channels
      .fetch(g.settings.channel)
      .then((c) => {
        if (!c || !c.isTextBased()) {
          errors.push({
            guildId: g.guildId,
            error: 'Invalid channel provided'
          });
          return;
        }
        c.send({
          content: `Message from Maintainer ${interaction.user.toString()}`,
          embeds: [new EmbedBuilder().setDescription(body).setColor(4182379)]
        }).catch((e) => errors.push({ guildId: g.guildId, error: e.message }));
      })
      .catch((e) => errors.push({ guildId: g.guildId, error: e.message }));
  });
  if (errors.length > 0) {
    interaction.editReply({
      content: 'Success! Messages are being broadcast to all servers, but some errors occurred'
    });
  } else {
    interaction.editReply({
      content: 'Success! Messages are being broadcast to all servers without errors'
    });
  }
}
