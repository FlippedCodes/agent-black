// init Discord
const { Client, Intents, Collection } = require('discord.js');
// init file system
const fs = require('fs');
// init command builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// setting essential global values
// init Discord client
global.client = new Client({ disableEveryone: true, intents: [Intents.FLAGS.GUILDS] });
// init config
global.config = require('./config.json');

global.DEBUG = process.env.NODE_ENV === 'development';

// global.main = {};
global.CmdBuilder = SlashCommandBuilder;

global.ERR = (err) => console.error('ERROR:', err);

// creating collections
client.commands = new Collection();
client.functions = new Collection();

// anouncing debug mode
if (DEBUG) console.log(`[${config.name}] Bot is on Debug-Mode. Some functions are not going to be loaded.`);

// Login the bot
client.login(process.env.DCtoken)
  .then(() => {
    // import Functions and Commands; startup database connection
    fs.readdirSync('./functions/STARTUP').forEach((FCN) => {
      if (FCN.search('.js') === -1) return;
      const INIT = require(`./functions/STARTUP/${FCN}`);
      INIT.run(fs);
    });
  });

client.on('ready', async () => {
  // confirm user logged in
  console.log(`[${config.name}] Logged in as "${client.user.tag}"!`);

  // setup tables
  console.log('[DB] Syncing tables...');
  await sequelize.sync();
  await console.log('[DB] Done syncing!');

  // run startup functions
  config.setup.setupFunctions.forEach((FCN) => {
    client.functions.get(FCN).run(client, config);
  });
});

client.on('ready', async () => {
  // confirm user logged in
  console.log(`[${config.name}] Logged in as "${client.user.tag}"!`);

  // setup tables
  console.log('[DB] Syncing tables...');
  await sequelize.sync();
  await console.log('[DB] Done syncing!');

  // set bot user status
  const setupFunctions = client.functions.filter((fcn) => fcn.data.callOn === 'setup');
  setupFunctions.forEach((FCN) => FCN.run());
});

// EVENT user gets banned
client.on('guildBanAdd', async (guild, user) => {
  if (await client.functions.get('FUNC_checkServer').run(guild.id, true)) {
    client.functions.get('EVENT_guildBanAdd').run(guild, user);
  }
});

// EVENT user gets unbanned
client.on('guildBanRemove', async (guild, user) => {
  if (await client.functions.get('FUNC_checkServer').run(guild.id, true)) {
    client.functions.get('EVENT_guildBanRemove').run(guild, user);
  }
});

// user joins the server
client.on('guildMemberAdd', async (member) => {
  if (await client.functions.get('FUNC_checkServer').run(member.guild.id, false)) {
    client.functions.get('EVENT_guildMemberAdd').run(client, member);
  }
});

// bot joins the server
client.on('guildCreate', async (guild) => {
  client.functions.get('EVENT_guildCreate').run(client, guild);
});

// bot leaves the server
client.on('guildDelete', async (guild) => {
  if (await client.functions.get('FUNC_checkServer').run(guild.id, true)) {
    client.functions.get('EVENT_guildDelete').run(client, guild);
  }
});

client.on('message', async (message) => {
  client.functions.get('EVENT_message').run(client, message, config);
});

// logging errors and warns
client.on('error', (e) => console.error(e));
client.on('warn', (e) => console.warn(e));
