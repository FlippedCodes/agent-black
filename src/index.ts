//#region Packages
import { Client, Collection, IntentsBitField } from 'discord.js';
import { CustomClient } from './typings/Extensions.js';
// Log developer mode
if (process.env.NODE_ENV === 'development') console.debug('Starting in development mode');
//#endregion

//#region Discord init
const client: CustomClient<false> = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildModeration,
    IntentsBitField.Flags.GuildEmojisAndStickers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.DirectMessages
  ]
});
client.logs = console;
// Load all functions
const funcs = await import('./functions/load.js').then((f) => f.execute(client)).catch((e) => client.logs.error(e));
if (!funcs) process.exit(1);
client.functions = funcs;
// Run all startup functions
Array.from(client.functions.keys())
  .filter((f) => f.startsWith('startup_'))
  .forEach((f) => client.functions.get(f).execute(client));
//#endregion
//#region Variables
client.commands = new Collection();
//#endregion
//#region Discord events
client.on('ready', () => {
  client.logs.info(`Logged in as ${client.user.tag}!`);
  // Run all ready functions
  Array.from(client.functions.keys())
    .filter((f) => f.startsWith('events_ready'))
    .forEach((f) => client.functions.get(f).execute(client));
});

client.on('interactionCreate', async (interaction) => {
  client.functions.get('events_interactionCreate_main').execute(client, interaction);
});

client.login(process.env.DCtoken);
//#endregion
