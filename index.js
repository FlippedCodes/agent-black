const Discord = require('discord.js');

const client = new Discord.Client({ disableEveryone: true });

const sequelize = require('sequelize');

const fs = require('fs');

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

// bot and mysql login
const testToken = './config/test_token.json';
let token;
let host;
let user;
let password;
let database;
// setting inDev var
if (fs.existsSync(testToken)) {
  config.env.set('inDev', true);
  const dev = require(testToken);
  token = dev.token;
  host = dev.DB_host;
  user = dev.DB_user;
  password = dev.DB_passw;
  database = dev.DB_name;
} else {
  config.env.set('inDev', false);
  token = process.env.BotTokenAgentBlack;
  host = process.env.DBHost;
  user = process.env.DBNameAgentBlack;
  password = process.env.DBPasswAgentBlack;
  database = process.env.DBNameAgentBlack;
}

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
