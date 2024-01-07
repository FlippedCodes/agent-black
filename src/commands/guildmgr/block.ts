import { CmdFileArgs } from '../../typings/Extensions.js';

export const name = 'block';
export async function execute({ client, interaction, options }: CmdFileArgs): Promise<void> {
  const guildId = options.getString('server', true);
  const guild = client.guilds.cache.get(guildId);
  if (!guild) {
    interaction.editReply({ content: 'Specified guild ID does not exist' });
    return;
  }
  const dbGuild = await client.models.guild.findOne({ where: { guildId } });
  if (!dbGuild) {
    interaction.editReply({ content: 'Specified guild ID is not in the database' });
    return;
  }
  dbGuild.banned = true;
  dbGuild.enabled = false;
  await dbGuild.save();
  interaction.editReply({ content: `Guild ${guild.name} has been blocked from using the bot` });
  return;
}
