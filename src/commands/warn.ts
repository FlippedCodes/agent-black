import { SlashCommandBuilder } from 'discord.js';
import { CmdFileArgs } from '../typings/Extensions.js';

export const ephemeral = true;
export const data = new SlashCommandBuilder()
  .setName('warn')
  .setDescription('Warns other servers about a specific user')
  .addSubcommand((cmd) => {
    return cmd
      .setName('add')
      .setDescription('Add warning to a user')
      .addUserOption((option) =>
        option.setName('target').setDescription('User to issue a warning to').setRequired(true)
      )
      .addStringOption((option) =>
        option.setName('message').setDescription('Statement regarding the user').setRequired(true)
      );
  })
  .addSubcommand((cmd) => {
    return cmd
      .setName('edit')
      .setDescription('Edit a existing warning.')
      .addNumberOption((option) => option.setName('id').setDescription('Unique warning ID').setRequired(true))
      .addStringOption((option) =>
        option.setName('message').setDescription('Statement regarding the user').setRequired(true)
      );
  });
export async function execute({ client, interaction, options }: CmdFileArgs): Promise<void> {
  const dbUser = await client.models.user.findOne({ where: { userId: interaction.user.id } });
  if ((!dbUser || dbUser.flags.has('Staff')) && interaction.memberPermissions.has('ModerateMembers')) {
    interaction.editReply({ content: 'You are not authorised to perform that action' });
    return;
  }
  const act = options.getSubcommand(true);
  client.commands.get(`${interaction.commandName}_${act}`).execute({ client, interaction, options });
}
