import { readdirSync, statSync } from 'node:fs';
import { CustomClient, SlashCommandFile } from '../../typings/Extensions.ts';
import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
const files: string[] = [];

function recursiveLookup(dir: string): string[] {
  readdirSync(dir).forEach((file: string) => {
    const absolute = `${dir}/${file}`;
    if (statSync(absolute).isDirectory()) return recursiveLookup(absolute);
    files.push(absolute);
  });
  return files;
}

export const fileName = 'commandInit';

export default async function (client: CustomClient): Promise<void> {
  const slashCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
  // List of files
  const commandFiles: string[] = recursiveLookup('./commands').filter((f: string) => f.endsWith('.js'));
  const commandLength: number = commandFiles.length;
  if (commandLength <= 0) return client.stdrr?.info(`[${fileName}] No command(s) to load!`);
  if (Deno.env.get('NODE_ENV'))
    client.stdrr?.debug(`[${fileName}] Loading ${commandLength} command${commandLength !== 1 ? 's' : ''}...`);

  for (const [i, file] of commandFiles.entries()) {
    const fileData: SlashCommandFile = await import(file);
    const cleanName: string = file.replace(/\\|\//g, '_').replace('commands_', '').replace('.js', '');
    // "continue" skips the rest of the loop and goes to the next iteration
    if (cleanName.search('archive_') !== -1) continue;
    if (Deno.env.get('NODE_ENV') === 'development')
      client.stdrr?.debug(`[${fileName}]     ${i + 1}) Loaded: ${cleanName}!`);
    client.commands.set(cleanName, fileData);
    // If the file has a data property, it's a slash command
    if (fileData.data) slashCommands.push(fileData.data.toJSON());
  }
  client.stdrr?.info(`[${fileName}] Loaded ${commandLength} command${commandLength !== 1 ? 's' : ''}!`);

  const slashCommandsLength = slashCommands.length;
  client.stdrr?.info(`[${fileName}] Registering ${slashCommandsLength} command${slashCommandsLength !== 1 ? 's' : ''}...`);
  
  // submit commands to discord api| Dev: one guild only, prod: globally
  if (Deno.env.get('NODE_ENV') === 'development') {
    const changedCommands = slashCommands.map((command) => {
      const newCommand = command;
      newCommand.name = `${command.name}_dev`;
      return newCommand;
    });
    await client.application?.commands.set(changedCommands, (Deno.env.get('devGuild') as string));
  } else await client.application?.commands.set(slashCommands);
  console.log(`[${fileName}] ${slashCommandsLength} command${slashCommandsLength !== 1 ? 's' : ''} registered!`);
}
