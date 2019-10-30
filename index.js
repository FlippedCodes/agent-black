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

// create new environment variable collection in config
config.env = new Discord.Collection();

// create new functions and commands collection in client
client.functions = new Discord.Collection();
client.commands = new Discord.Collection();

// import Functions and Commands
config.setup.startupFunctions.forEach((FCN) => {
  let INIT = require(`./functions/${FCN}.js`);
  INIT.run(client, fs, config);
});

// create conenction to DB
require('./database/SETUP_DBConnection');

let DB = mysql.createConnection({
  host, user, password, database,
});

// Login the bot
client.login(token);

client.on('ready', async () => {
  // confirm user logged in
  console.log(`Logged in as ${client.user.tag}!`);
  // set bot player status
  config.setup.setupFunctions.forEach((FCN) => {
    client.functions.get(FCN).run(client, config, DB);
  });
});

client.on('message', async (message) => {
  client.functions.get('EVENT_message').run(client, message, DB, config);
});

// logging errors
client.on('error', (e) => console.error(e));
client.on('warn', (e) => console.warn(e));
