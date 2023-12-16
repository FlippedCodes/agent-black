import { SlashCommandBuilder } from 'discord.js';
import { readdirSync } from 'node:fs';
import { CommandFile, CustomClient } from '../../../typings/Extensions.js';

export const name = 'commands';
export async function execute(client: CustomClient<true>): Promise<void> {
  const { NODE_ENV, devGuild } = process.env;
  // Get all files in the commands directory
  const files = readdirSync('./commands', { recursive: true })
    // Map Buffers to string
    .map((f) => String(f))
    // Trim directory
    .map((f) => f.replace('./commands/', ''))
    // Remove Windows backslashes
    .map((f) => f.replace('\\', '/'))
    // Filter out non-JS files
    .filter((f) => f.endsWith('.js'));
  // For each file, load the command
  const cmds: ReturnType<SlashCommandBuilder['toJSON']>[] = [];
  client.logs.debug(`F | ✦ Expecting ${files.length} command files`);
  for (const file of files) {
    try {
      const command: CommandFile = await import(`../../../commands/${file}`);
      // Rewrite cmd name if development and push if found
      if (command.data && NODE_ENV === 'development') command.data.setName(`d_${command.data.name}`);
      if (command.data) cmds.push(command.data.toJSON());
      const n = file.replace(/\.js$/, '').replace(/\//g, '_');
      client.commands.set(n, command);
      client.logs.info(`F | ✓ ${n}`);
    } catch (err) {
      client.logs.error({ msg: `F | ✘ ${file}`, err });
    }
  }
  // Register the commands
  if (NODE_ENV === 'development') {
    // Testing server if development
    client.guilds
      .fetch(devGuild)
      .then((g) => g.commands.set(cmds))
      .catch(() => null);
  } else {
    // Global if production
    await client.application.commands.set(cmds);
  }
  client.logs.debug(`F | ✦ Registered ${cmds.length} commands`);
  return;
}
