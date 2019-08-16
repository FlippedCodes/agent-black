const Discord = require('discord.js');

const client = new Discord.Client({ disableEveryone: true });

const mysql = require('mysql');

const fs = require('fs');

const config = require('./config/main.json');

config.env = new Discord.Collection();

// bot and mysql login
let token;
let host;
let user;
let password;
let database;
if (fs.existsSync('./config/test_token.json')) {
  const dev = require('./config/test_token.json');
  token = dev.token;
  host = dev.DB_host;
  user = dev.DB_user;
  password = dev.DB_passw;
  database = dev.DB_name;
} else {
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
fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);
  let jsfiles = files.filter(f => f.split('.').pop() === 'js');
  if (jsfiles.length <= 0) return console.log(`[${config.name}] No CMD(s) to load!`);
  console.log(`[${config.name}] Loading ${jsfiles.length} command(s)...`);
  jsfiles.forEach((f, i) => {
    let probs = require(`./commands/${f}`);
    console.log(`[${config.name}]     ${i + 1}) Loaded: ${f}!`);
    client.commands.set(probs.help.name, probs);
  });
  console.log(`[${config.name}] Loaded ${jsfiles.length} command(s)!`);
});

// function lister
client.functions = new Discord.Collection();
fs.readdir('./functions/', (err, files) => {
  if (err) console.error(err);
  let jsfiles = files.filter(f => f.split('.').pop() === 'js');
  if (jsfiles.length <= 0) return console.log(`[${config.name}] No function(s) to load!`);
  console.log(`[${config.name}] Loading ${jsfiles.length} function(s)...`);
  jsfiles.forEach((f, i) => {
    let probs = require(`./functions/${f}`);
    console.log(`[${config.name}]     ${i + 1}) Loaded: ${f}!`);
    client.functions.set(probs.help.name, probs);
  });
  console.log(`[${config.name}] Loaded ${jsfiles.length} function(s)!`);
});

client.on('ready', async () => {
  // confirm user logged in
  console.log(`[${config.name}] Logged in as ${client.user.tag}!`);

  // set bot player status
  client.functions.get('setup_status').run(client, fs, config)
    .then(() => console.log(`[${config.name}] Set status!`));
});

client.on('message', async (message) => {
  // return if unwanted
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;

  // checking if staffmember
  if (message.member.roles.find(role => role.id === config.team)) config.env.set('isTeam', true);

  // cease function call
  client.functions.get('cease').run(client, message, DB, config);

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
  } else message.channel.send(`Sry, but \`${message.content}\` doesn't exist...\nTry \`${config.prefix}help\` to find out what I can do for you!`);
});

// logging errors
client.on('error', e => console.error(e));
client.on('warn', e => console.warn(e));
