import { existsSync, readdirSync } from 'node:fs';
import { CustomClient, FunctionFile } from '../typings/Extensions.js';

export const name = 'load';
// This loads all functions
export async function execute(client: CustomClient<false>): Promise<Map<string, FunctionFile>> {
  // Check for functions folder
  if (!existsSync('./functions')) {
    console.warn('F | ! No functions were found! Make sure you are running index.js from the dist directory');
    return new Map() as Map<never, never>;
  }
  client.logs.debug('F | ✦ Loading all functions');
  // Read the directory
  const functionFiles: string[] = readdirSync(`./functions`, { recursive: true })
    // Ensure all file names are strings
    .map((f: unknown) => String(f))
    // Trim directory
    .map((f: string) => f.replace(`./functions/`, ''))
    // Remove Windows backslashes
    .map((f: string) => f.replace(/\\/g, '/'))
    // Filter out non-JS files
    .filter((f: string) => f.endsWith('.js'));
  // Load the functions
  client.logs.debug(`F | ✦ Found ${functionFiles.length} function`);
  // Initialise variables
  // deepcode ignore CollectionUpdatedButNeverQueried: Used in return
  const functions = new Map();
  for (const file of functionFiles) {
    // Set the file
    try {
      const func: FunctionFile = await import(`../functions/${file}`);
      const name = file.replace(/\.js$/, '').replace(/\//g, '_');
      // Skip if it's an archive
      if (name.includes('archive_')) continue;
      functions.set(name, func);
      client.logs.debug(`F | ✓ ${name}`);
    } catch (err) {
      client.logs.error({ msg: `F | ✗ ${file}`, err });
    }
  }
  // Return values
  return functions;
}
