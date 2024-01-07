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
  // Initially use the raw filename
  for (let name of files) {
    try {
      const command: CommandFile = await import(`../../../commands/${name}`);
      // Rewrite cmd name if development
      if (command.data && NODE_ENV === 'development') command.data.setName(`d_${command.data.name}`);
      // If the command has data, use that and push data
      if (command.data) {
        name = command.data.name;
        cmds.push(command.data.toJSON());
      }
      // Reassign to function-friendly name
      name = name.replace(/\.js$/, '').replace(/\//g, '_');
      client.commands.set(name, command);
      client.logs.info(`F | ✓ ${name}`);
    } catch (err) {
      client.logs.error({ msg: `F | ✘ ${name}`, err });
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
