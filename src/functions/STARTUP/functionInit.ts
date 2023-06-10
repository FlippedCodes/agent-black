import { readdirSync, statSync } from 'node:fs';
import { CustomClient, FunctionFile } from '../../typings/Extensions.ts';
const files: string[] = [];

function recursiveLookup(dir: string): string[] {
  readdirSync(dir).forEach((file: string) => {
    const absolute = `${dir}/${file}`;
    if (statSync(absolute).isDirectory()) return recursiveLookup(absolute);
    files.push(absolute);
  });
  return files;
}

export const fileName = 'functionInit';

export default async function (client: CustomClient): Promise<void> {
  // List of files
  const functionFiles: string[] = recursiveLookup('./functions').filter((f: string) => f.endsWith('.js'));
  const functionLength: number = functionFiles.length;
  if (functionLength <= 0) return client.stdrr?.info(`[${fileName}] No function(s) to load!`);
  if (Deno.env.get('NODE_ENV'))
    client.stdrr?.debug(`[${fileName}] Loading ${functionLength} function${functionLength !== 1 ? 's' : ''}...`);

  for (const [i, file] of functionFiles.entries()) {
    const fileData: FunctionFile = await import(file);
    const cleanName: string = file.replace(/\\|\//g, '_').replace('functions_', '').replace('.js', '');
    // "continue" skips the rest of the loop and goes to the next iteration
    if (cleanName.search('archive_') !== -1) continue;
    if (Deno.env.get('NODE_ENV') === 'development')
      client.stdrr?.debug(`[${fileName}]     ${i + 1}) Loaded: ${cleanName}!`);
    client.functions?.set(cleanName, fileData);
  }
  client.stdrr?.info(`[${fileName}] Loaded ${functionLength} function${functionLength !== 1 ? 's' : ''}!`);
}
