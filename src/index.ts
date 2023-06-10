//#region Packages
import { Client, IntentsBitField, Collection } from 'discord.js';
import { CustomClient } from './typings/Extensions.ts';
import { default as bunyan, createLogger } from 'bunyan';
import { readdirSync } from 'node:fs';
const stdrr: bunyan = createLogger({
  name: 'main',
  stream: Deno.stdout
});
// Log developer mode
if (Deno.env.get('NODE_ENV') === 'development') stdrr.debug('Starting in development mode');
//#endregion

//#region Discord init
const client: CustomClient = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildModeration,
    IntentsBitField.Flags.GuildEmojisAndStickers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.DirectMessages
  ]
});
client.stdrr = stdrr;
//#endregion
//#region Variables
client.commands = new Collection();

//#endregion
//#region Discord events
client.on('ready', () => {
  stdrr.info(`Logged in as ${client.user?.tag}!`);
  // Functions
  readdirSync('./functions/READY').forEach(async (file: string) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    (await import(`./functions/READY/${file}`))(client);
  });
});
client.login(Deno.env.get('DCtoken'));
//#endregion
//#region Error handling
