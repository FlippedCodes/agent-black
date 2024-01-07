import { CmdFileArgs } from '../../typings/Extensions.js';

export const name = 'block';
export async function execute({ client, interaction, options }: CmdFileArgs): Promise<void> {
  const guildId = options.getString('server', true);
  const dbGuild = await client.models.guild.findOne({ where: { guildId } });
  if (!dbGuild) {
    interaction.editReply({ content: 'Specified guild ID is not in the database' });
    return;
  }
  dbGuild.enabled = false;
  await dbGuild.save();
  interaction.editReply({ content: `Guild \`${guildId}\` has been disabled from using the bot` });
  return;
}
