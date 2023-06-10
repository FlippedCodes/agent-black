import { CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from '../typings/Extensions.ts';
import { StaffFlags } from '../typings/StaffFlags.ts';
import StaffFlagsBitField from '../typings/StaffFlagsBitField.ts';

export const name = 'broadcast';
export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('Broadcasts a message to all participating servers')
  .addStringOption((option) => {
    return option.setName('message').setDescription('Content to message to servers').setRequired(true);
  });
export async function run(
  client: CustomClient,
  interaction: CommandInteraction,
  options: CommandInteractionOptionResolver
): Promise<void> {
  await interaction.deferReply({ ephemeral: true });
  const dbUser = await client.models?.User.findOne({
    where: { userId: interaction.user.id }
  });
  if (!dbUser) {
    await interaction.editReply({
      content: 'You are not authorized to use this command'
    });
    return Promise.resolve();
  }
  const flags = new StaffFlagsBitField(BigInt(dbUser.flags));
  if (!flags.has(StaffFlags.Maintainer)) {
    await interaction.editReply({
      content: 'You are not authorized to use this command'
    });
    return Promise.resolve();
  }
  // Convert body
  const body = options.getString('message', true).replace(/\\n/g, '\n');
  // Send message
  interaction.editReply({ content: 'Sending messages...' });
  const guilds = await client.models?.Guild.findAll({
    where: { enabled: true, banned: false }
  });
  const errors: { guildId: string; error: string }[] = [];
  guilds?.forEach((g) => {
    client.channels.fetch(g.settings.channel).then((c) => {
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
    });
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
