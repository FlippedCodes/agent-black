import { ChatInputCommandInteraction } from 'discord.js';
import { CustomClient } from '../../typings/Extensions.js';

// Safely escapes backticks and backslashes
function escape(str: string): string {
  return str.replace('\\', '\\\\').replace('`', '\\`');
}

export const name = 'edit';
export async function run(
  client: CustomClient<true>,
  interaction: ChatInputCommandInteraction,
  options: ChatInputCommandInteraction['options']
): Promise<void> {
  const entry = await client.models.warn.findOne({
    where: {
      warnId: options.getNumber('id', true),
      guildId: interaction.guildId
    }
  });
  if (!entry) {
    interaction.editReply({ content: 'That warning does not exist' });
    return;
  }
  // Get the target
  // Update the entry
  entry.reason = options.getString('message', true);
  await entry.save();
  interaction.editReply({ content: 'Warning updated. Servers will be updated shortly' });
  // Warn other servers
  const t = await client.users.fetch(entry.targetId)!;
  client.functions
    .get('utils_masterMessage')
    .execute(
      client,
      `Warning updated for ${t.username} (${t.id}) who is in your server. Reason: \n\`\`\`\n${escape(
        entry.reason
      )}\`\`\``
    );
}
