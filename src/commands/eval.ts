import { CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { CustomClient } from '../typings/Extensions.ts';
import { StaffFlags } from '../typings/StaffFlags.ts';
import StaffFlagsBitField from '../typings/StaffFlagsBitField.ts';

export const name = 'eval';
export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('Runs snippets of code')
  .addStringOption((option) => {
    return option.setName('script').setDescription('The code to run').setRequired(true);
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
    interaction.editReply({
      content: 'You are not authorized to use this command'
    });
    return Promise.resolve();
  }
  const flags = new StaffFlagsBitField(BigInt(dbUser.flags));
  if (!flags.has(StaffFlags.Owner)) {
    interaction.editReply({
      content: 'You are not authorized to use this command'
    });
    return Promise.resolve();
  }
  // Execute command
  const result = eval(options.getString('script', true));
  interaction.editReply({
    embeds: [
      new EmbedBuilder().setTitle('Evaluation').setDescription(`\`\`\`js\n${JSON.stringify(result, null, 2)}\`\`\``)
    ]
  });
  return Promise.resolve();
}
