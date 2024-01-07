import { CmdFileArgs } from '../../typings/Extensions.js';

// Safely escapes backticks and backslashes
function escape(str: string): string {
  return str.replace('\\', '\\\\').replace('`', '\\`');
}

export const name = 'add';
export async function execute({ client, interaction, options }: CmdFileArgs): Promise<void> {
  const t = options.getUser('target');
  const w = await client.models.warn.create({
    guildId: interaction.guild.id,
    targetId: t.id,
    reason: options.getString('message')
  });
  interaction.editReply({ content: `Successfully created warning ${w.warnId}. Scanning for affected servers` });
  // Warn servers
  client.functions
    .get('utils_masterMessage')
    .execute(
      client,
      `New warning issued for ${t.username} (${t.id}) who is in your server. Reason: \n\`\`\`\n${escape(
        w.reason
      )}\`\`\``
    );
}
