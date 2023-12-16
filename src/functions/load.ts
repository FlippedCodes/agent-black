import { existsSync, readdirSync } from 'node:fs';
import { CustomClient, FunctionFile } from '../typings/Extensions.js';

// This loads all functions
export async function run(client: CustomClient<false>): Promise<void> {
  // Check for functions folder
  if (!existsSync('./functions')) {
    console.warn('F | ! No functions were found! Make sure you are running index.js from the dist directory');
    return;
  }
  client.logs.debug('F | ✦ Loading all functions');
  // Initialise variable
  const functionFiles: { [key: string]: string[] } = {};
  // Read the directory
  const types: string[] = readdirSync('./functions').filter((f: string) => !f.endsWith('.js'));
  // For each type, load the files
  for (const type of types) {
    functionFiles[type] = readdirSync(`./functions/${type}`, { recursive: true })
      // Map Buffers to string
      .map((f: unknown) => String(f))
      // Trim directory
      .map((f: string) => f.replace(`./functions/${type}/`, ''))
      // Remove Windows backslashes
      .map((f: string) => f.replace('\\', '/'))
      // Filter out non-JS files
      .filter((f: string) => f.endsWith('.js'));
  }
  // Load the functions
  const functions = new Map();
  for (const [type, files] of Object.entries(functionFiles)) {
    client.logs.debug(`F | ✦ Found ${files.length} ${type} function`);
    // Set the file
    for (const file of files) {
      try {
        const f: FunctionFile = await import(`../functions/${type}/${file}`);
        const n = file.replace(/\.js$/, '').replace(/\//g, '_');
        // Skip if it's an archive
        if (n.includes('archive_')) continue;
        functions.set(type + '_' + n, f);
        client.logs.debug(`F | ✓ ${n}`);
      } catch (err) {
        client.logs.error({ msg: `F | ✗ ${file}`, err });
      }
    }
  }
  // Attach the functions
  client.functions = functions;
  client.ready = true;
  // Return void
  return;
}

// if name has archive_, drop it
