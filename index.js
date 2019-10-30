const Discord = require('discord.js');

const client = new Discord.Client({ disableEveryone: true });

const mysql = require('mysql');

const fs = require('fs');

const config = require('./config/main.json');

// create new environment variable collection in config
config.env = new Discord.Collection();

// create new functions collection in client
client.functions = new Discord.Collection();

// import Function importer
const initFunctions = require('./functions/SETUP_initFunctions.js');

// get functions
initFunctions.run(Discord, client, fs, config);

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

client.login(token);
let DB = mysql.createConnection({
  host, user, password, database,
});

// command lister
client.commands = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);
  let jsfiles = files.filter((f) => f.split('.').pop() === 'js');
  if (jsfiles.length <= 0) return console.log('No CMD(s) to load!');
  console.log(`Loading ${jsfiles.length} command(s)...`);
  jsfiles.forEach((f, i) => {
    let probs = require(`./commands/${f}`);
    console.log(`    ${i + 1}) Loaded: ${f}!`);
    client.commands.set(probs.help.name, probs);
  });
  console.log(`Loaded ${jsfiles.length} command(s)!`);
});

client.on('ready', async () => {
  // confirm user logged in
  console.log(`Logged in as ${client.user.tag}!`);

  // set bot player status
  client.functions.get('SETUP_status').run(client, fs, config)
    .then(() => console.log('Set status!'));

  // Load and posting bot status
  console.log('Posting bot status message!');
  client.functions.get('SETUP_offlineStat').run(client, config, DB, fs);
});

client.on('message', async (message) => {
  client.functions.get('EVENT_message').run(client, message, DB, config);
});

// logging errors
client.on('error', (e) => console.error(e));
client.on('warn', (e) => console.warn(e));
