const Discord = require('discord.js');

const client = new Discord.Client({ disableEveryone: true });

const mysql = require('mysql');

const fs = require('fs');

const config = require('./config/main.json');

config.env = new Discord.Collection();

// bot and mysql login
// also setting inDev var
let token;
let host;
let user;
let password;
let database;
if (fs.existsSync('./agent-black-bot/config/test_token.json')) {
  config.env.set('inDev', true);
  const dev = require('../agent-black-bot/config/test_token.json');
  token = dev.token;
  host = dev.DB_host;
  user = dev.DB_user;
  password = dev.DB_passw;
  database = dev.DB_name;
} else {
  config.env.set('inDev', false);
  token = process.env.BotToken;
  host = process.env.DB_host;
  user = process.env.DB_user;
  password = process.env.DB_passw;
  database = process.env.DB_name;
}
client.login(token);
let DB = mysql.createConnection({ host, user, password, database });

// command lister
client.commands = new Discord.Collection();
fs.readdir('./agent-black-bot/commands/', (err, files) => {
  if (err) console.error(err);
  let jsfiles = files.filter(f => f.split('.').pop() === 'js');
  if (jsfiles.length <= 0) return console.log('No CMD(s) to load!');
  console.log(`Loading ${jsfiles.length} command(s)...`);
  jsfiles.forEach((f, i) => {
    let probs = require(`../agent-black-bot/commands/${f}`);
    console.log(`    ${i + 1}) Loaded: ${f}!`);
    client.commands.set(probs.help.name, probs);
  });
  console.log(`Loaded ${jsfiles.length} command(s)!`);
});

// function lister
client.functions = new Discord.Collection();
fs.readdir('./agent-black-bot/functions/', (err, files) => {
  if (err) console.error(err);
  let jsfiles = files.filter(f => f.split('.').pop() === 'js');
  if (jsfiles.length <= 0) return console.log('No function(s) to load!');
  console.log(`Loading ${jsfiles.length} function(s)...`);
  jsfiles.forEach((f, i) => {
    let probs = require(`../agent-black-bot/functions/${f}`);
    console.log(`    ${i + 1}) Loaded: ${f}!`);
    client.functions.set(probs.help.name, probs);
  });
  console.log(`Loaded ${jsfiles.length} function(s)!`);
});

client.on('ready', async () => {
  // confirm user logged in
  console.log(`Logged in as ${client.user.tag}!`);

  // set bot player status
  client.functions.get('setup_status').run(client, fs, config)
    .then(() => console.log('Set status!'));

  // Load and posting bot status
  // console.log('Posting bot status message!');
  // client.functions.get('setup_offlineStat').run(client, config, DB, fs);
});

client.on('message', async (message) => {
  // return if unwanted
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;

  // checking if staffmember
  if (message.member.roles.find(role => role.id === config.team)) config.env.set('isTeam', true);
  // put needed user permission-IDs into DB
  // with permissions on what CMDs
  // TODO: Permission System

  // put comamnd in array
  let messageArray = message.content.split(/\s+/g);
  let command = messageArray[0];
  let args = messageArray.slice(1);

  // return if not prefix
  if (!command.startsWith(config.prefix)) return;

  // remove prefix and lowercase
  let cmd = client.commands.get(command.slice(config.prefix.length).toLowerCase());

  // run cmd if existent
  if (cmd) {
    cmd.run(client, message, args, DB, config)
      .catch(console.log);
  }
});

// logging errors
client.on('error', e => console.error(e));
client.on('warn', e => console.warn(e));
