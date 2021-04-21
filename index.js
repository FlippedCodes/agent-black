// init Discord
const Discord = require('discord.js');
// init Discord client
const client = new Discord.Client({ disableEveryone: true });
// init sequelize
const sequelize = require('sequelize');
// init filesystem
const fs = require('fs');
// init config
const config = require('./config/main.json');

// create new collections in client and config
client.functions = new Discord.Collection();
client.commands = new Discord.Collection();
config.env = new Discord.Collection();

// import Functions and Commands
config.setup.startupFunctions.forEach((FCN) => {
  const INIT = require(`./functions/${FCN}.js`);
  INIT.run(client, fs, config);
});

// Login the bot
client.login(config.env.get('token'));

client.on('ready', async () => {
  // confirm user logged in
  console.log(`[${config.name}] Logged in as "${client.user.tag}"!`);

  // // setup tables
  // console.log('[DB] Syncing tables...');
  // // eslint-disable-next-line no-undef
  // await sequelize.sync();
  // await console.log('[DB] Done syncing!');

  // run startup functions
  config.setup.setupFunctions.forEach((FCN) => {
    client.functions.get(FCN).run(client, config);
  });
});

client.once('ready', async () => {
  // set bot player status
  config.setup.setupFunctionsOnce.forEach((FCN) => {
    client.functions.get(FCN).run(client, config);
  });
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

client.on('message', async (message) => {
  client.functions.get('EVENT_message').run(client, message, config);
});

// logging errors
client.on('error', (e) => console.error(e));
client.on('warn', (e) => console.warn(e));
